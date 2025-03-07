# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token, only: %i[show]
  before_action :load_post!, only: %i[show]

  def index
    @posts = if current_user
      Post.where(organization_id: current_user.organization_id).includes(:categories, :user)
             else
               Post.none
    end
    if params[:category_ids].present?
      category_ids = params[:category_ids].split(",")
      post_ids = Post.joins(:categories).where(categories: { id: category_ids }).distinct.pluck(:id)
      @posts = @posts.where(id: post_ids)
    end

    render :index
  end

  def create
    post = Post.new(post_params)
    post.save!
    render_notice(t("successfully_created"))
  end

  def show
    render :show
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, :user_id, :organization_id, category_ids: [])
    end

    def load_post!
      @post = Post.find_by!(slug: params[:slug])
    end
end
