# frozen_string_literal: true

class Post < ApplicationRecord
  MAXIMUM_TITLE_LENGTH = 125
  MAXIMUM_DESCRIPTION_LENGTH = 10000

  attribute :status, :string

  enum status: { draft: "draft", published: "published" }, _default: :published

  belongs_to :user
  belongs_to :organization
  has_and_belongs_to_many :categories
  has_many :votes, dependent: :destroy
  has_many :voters, through: :votes, source: :user

  validates :title, presence: true, length: { maximum: MAXIMUM_TITLE_LENGTH }
  validates :description, presence: true, length: { maximum: MAXIMUM_DESCRIPTION_LENGTH }
  validates_inclusion_of :is_bloggable, in: [true, false]
  validates :slug, uniqueness: true
  validate :slug_not_changed

  before_create :set_slug

  def vote_by(user, vote_type)
    vote = votes.find_or_initialize_by(user: user)

    if vote.new_record?
      vote.vote_type = vote_type
      vote.save
    elsif vote.vote_type.to_s != vote_type.to_s
      vote.update(vote_type: vote_type)
    else
      vote.destroy
    end

    update_bloggable_status
  end

  def upvoted_by?(user)
    votes.exists?(user: user, vote_type: :upvote)
  end

  def downvoted_by?(user)
    votes.exists?(user: user, vote_type: :downvote)
  end

  def upvote_ratio
    return 0 if votes_count == 0

    upvotes.to_f / votes_count
  end

  def update_bloggable_status
    if upvote_ratio > 0.7 && !is_bloggable
      update(is_bloggable: true)
    elsif upvote_ratio < 0.7 && is_bloggable
      update(is_bloggable: false)
    end
  end

  def score
    up = [upvotes || 0, 0].max
    down = [downvotes || 0, 0].max
    up - down
  end

  private

    def set_slug
      title_slug = title.parameterize
      regex_pattern = "slug #{Constants::DB_REGEX_OPERATOR} ?"
      latest_post_slug = Post.where(
        regex_pattern,
        "^#{title_slug}$|^#{title_slug}-[0-9]+$"
      ).order("LENGTH(slug) DESC", slug: :desc).first&.slug
      slug_count = 0
      if latest_post_slug.present?
        slug_count = latest_post_slug.split("-").last.to_i
        only_one_slug_exists = slug_count == 0
        slug_count = 1 if only_one_slug_exists
      end
      slug_candidate = slug_count.positive? ? "#{title_slug}-#{slug_count + 1}" : title_slug
      self.slug = slug_candidate
    end

    def slug_not_changed
      if will_save_change_to_slug? && self.persisted?
        errors.add(:slug, I18n.t("post.slug.immutable"))
      end
    end

    def unvote(user)
    end
end
