# frozen_string_literal: true

class Vote < ApplicationRecord
  enum vote_type: { upvote: 1, downvote: -1 }

  belongs_to :post, counter_cache: true
  belongs_to :user

  validates :user_id, uniqueness: { scope: :post_id, message: "has already voted for this post" }

  after_create :update_vote_type_counts
  after_update :update_vote_type_counts_on_update
  after_destroy :update_vote_type_counts_on_destroy

  private

    def update_vote_type_counts
      if upvote?
        post.increment!(:upvotes)
      else
        post.increment!(:downvotes)
      end
    end

    def update_vote_type_counts_on_update
      if saved_change_to_vote_type?
        old_vote_type, new_vote_type = saved_change_to_vote_type

        if old_vote_type.to_s == "upvote"
          post.decrement!(:upvotes)
        else
          post.decrement!(:downvotes)
        end

        if new_vote_type.to_s == "upvote"
          post.increment!(:upvotes)
        else
          post.increment!(:downvotes)
        end
      end
    end

    def update_vote_type_counts_on_destroy
      if upvote?
        post.decrement!(:upvotes)
      else
        post.decrement!(:downvotes)
      end
    end
end
