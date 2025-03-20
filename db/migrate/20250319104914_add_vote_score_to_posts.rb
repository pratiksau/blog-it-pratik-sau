# frozen_string_literal: true

class AddVoteScoreToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :vote_score, :integer, default: 0, null: false
  end
end
