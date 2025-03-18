# frozen_string_literal: true

class BulkPostUpdateService
  attr_reader :user, :post_ids, :target_status

  def initialize(user:, post_ids:, target_status:)
    @user = user
    @post_ids = post_ids
    @target_status = target_status
  end

  def call
    return 0 if post_ids.blank?

    updated_count = Post.where(user_id: user.id)
      .where(id: post_ids)
      .where.not(status: target_status)
      .update_all(status: target_status)

    updated_count
  end
end
