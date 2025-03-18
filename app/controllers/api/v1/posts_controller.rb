# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  after_action :verify_authorized, except: %i[index user_posts]
  after_action :verify_policy_scoped, only: %i[index user_posts]

  before_action :load_post!, only: %i[show update destroy]

  def index
    @posts = policy_scope(Post).includes(:categories, :user)

    if params[:category_ids].present?
      category_ids = params[:category_ids].split(",")
      post_ids = Post.joins(:categories).where(categories: { id: category_ids }).distinct.pluck(:id)
      @posts = @posts.where(id: post_ids)
    end
  end

  def create
    post = Post.new(post_params)
    post.organization_id = current_user.organization_id
    authorize post
    post.save!
    render_notice(t("successfully_created"))
  end

  def show
    authorize @post
  end

  def update
    authorize @post
    safe_params = post_params.except(:organization_id)
    @post.update!(safe_params)
    render_notice(t("successfully_updated")) unless params.key?(:quiet)
  end

  def destroy
    authorize @post
    @post.destroy!
    render_notice(t("successfully_deleted"))
  end

  def user_posts
    base_posts = policy_scope(Post).includes(:categories, :user).where(user_id: current_user.id)
    @posts = PostFilterService.new(base_posts, params).filter
  end

  def bulk_update
    post_ids = params[:post_ids]
    target_status = params.require(:status)

    if post_ids.blank?
      render json: { error: "No post IDs provided" }, status: :bad_request
      return
    end

    authorize Post, :bulk_update?

    updated_count = BulkPostUpdateService.new(
      user: current_user,
      post_ids: post_ids,
      target_status: target_status
    ).call

    render json: { notice: "#{updated_count} posts updated to #{target_status}." }
  end

  def bulk_destroy
    post_ids = params[:post_ids]

    if post_ids.blank?
      render json: { error: "No post IDs provided" }, status: :bad_request
      return
    end

    authorize Post, :bulk_destroy?

    deleted_count = BulkPostDestroyService.new(
      user: current_user,
      post_ids: post_ids
    ).call

    render json: { notice: "#{deleted_count} posts successfully deleted." }
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, :user_id, :organization_id, :status, category_ids: [])
    end

    def load_post!
      @post = Post.find_by!(slug: params[:slug])
    end
end
