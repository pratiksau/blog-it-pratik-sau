# frozen_string_literal: true

class PopulateVoteScoreForPosts < ActiveRecord::Migration[7.1]
  def up
    Post.reset_column_information
    Post.find_each do |post|
      score = post.upvotes - post.downvotes
      post.update_column(:vote_score, score)
    end
  end

  def down
  end
end
