# frozen_string_literal: true

class BulkPostDestroyService
  attr_reader :user, :post_ids

  def initialize(user:, post_ids:)
    @user = user
    @post_ids = post_ids
  end

  def call
    return 0 if post_ids.blank?

    posts_to_delete = Post.where(user_id: user.id)
      .where(id: post_ids)

    count = posts_to_delete.count

    Post.transaction do
      posts_to_delete.destroy_all
    end

    count
  end
end
