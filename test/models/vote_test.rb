# frozen_string_literal: true

require "test_helper"

class VoteTest < ActiveSupport::TestCase
  def setup
    @user = create(:user)
    @post = create(:post)
  end

  test "user can upvote a post" do
    vote = Vote.create(user: @user, post: @post, vote_type: :upvote)
    assert vote.valid?
    assert_equal 1, @post.reload.upvotes
    assert_equal 0, @post.reload.downvotes
    assert_equal 1, @post.reload.votes_count
  end

  test "user can downvote a post" do
    vote = Vote.create(user: @user, post: @post, vote_type: :downvote)
    assert vote.valid?
    assert_equal 0, @post.reload.upvotes
    assert_equal 1, @post.reload.downvotes
    assert_equal 1, @post.reload.votes_count
  end

  test "counter cache and individual counts remain in sync" do
    vote1 = Vote.create(user: @user, post: @post, vote_type: :upvote)
    user2 = create(:user)
    vote2 = Vote.create(user: user2, post: @post, vote_type: :upvote)
    user3 = create(:user)
    vote3 = Vote.create(user: user3, post: @post, vote_type: :downvote)

    assert_equal 2, @post.reload.upvotes
    assert_equal 1, @post.reload.downvotes
    assert_equal 3, @post.reload.votes_count

    # Change a vote
    vote1.update(vote_type: :downvote)
    assert_equal 1, @post.reload.upvotes
    assert_equal 2, @post.reload.downvotes
    assert_equal 3, @post.reload.votes_count

    # Remove a vote
    vote3.destroy
    assert_equal 1, @post.reload.upvotes
    assert_equal 1, @post.reload.downvotes
    assert_equal 2, @post.reload.votes_count
  end

  test "user cannot vote twice on the same post" do
    Vote.create(user: @user, post: @post, vote_type: :upvote)
    duplicate_vote = Vote.new(user: @user, post: @post, vote_type: :upvote)
    assert_not duplicate_vote.valid?
  end

  test "user can change vote from upvote to downvote" do
    vote = Vote.create(user: @user, post: @post, vote_type: :upvote)
    vote.update(vote_type: :downvote)
    assert_equal 0, @post.reload.upvotes
    assert_equal 1, @post.reload.downvotes
    assert_equal 1, @post.reload.votes_count
  end
end
