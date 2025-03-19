# frozen_string_literal: true

class AddVotesCountToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :votes_count, :integer, default: 0, null: false

    Post.find_each do |post|
      Post.reset_counters(post.id, :votes)
    end
  end
end
