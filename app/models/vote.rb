# frozen_string_literal: true

class Vote < ApplicationRecord
  enum vote_type: { upvote: 1, downvote: -1 }

  belongs_to :post, counter_cache: true
  belongs_to :user

  validates :user_id, uniqueness: { scope: :post_id, message: "has already voted for this post" }

  after_create :update_post_vote_counts
  after_update :update_post_vote_counts
  after_destroy :update_post_vote_counts

  private

    def update_post_vote_counts
      upvotes_count = post.votes.upvote.count
      downvotes_count = post.votes.downvote.count

      post.update_columns(upvotes: upvotes_count, downvotes: downvotes_count)
    end
end
