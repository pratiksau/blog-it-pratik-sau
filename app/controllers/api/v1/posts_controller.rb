# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  before_action :load_post!, only: %i[show]

  def index
    posts = Post.includes(:categories, :user)

    if params[:category_ids].present?
      category_ids = params[:category_ids].split(",")
      post_ids = Post.joins(:categories).where(categories: { id: category_ids }).distinct.pluck(:id)
      posts = posts.where(id: post_ids)
    end

    render status: :ok,
      json: { posts: posts.as_json(include: { categories: { only: %i[id name] }, user: { only: %i[id name] } }) }
  end

  def create
    post = Post.new(post_params)
    post.save!
    render_notice(t("successfully_created"))
  end

  def show
    render_json({ post: @post.as_json(include: { categories: { only: %i[id name] }, user: { only: %i[id name] } }) })
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, :user_id, :organization_id, category_ids: [])
    end

    def load_post!
      @post = Post.find_by!(slug: params[:slug])
    end
end
