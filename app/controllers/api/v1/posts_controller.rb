# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  after_action :verify_authorized, except: %i[index]
  after_action :verify_policy_scoped, only: %i[index]

  skip_before_action :authenticate_user_using_x_auth_token, only: %i[show]
  before_action :load_post!, only: %i[show]

  def index
    @posts = policy_scope(Post)
  end

  def create
    post = Post.new(post_params)
    authorize post
    post.save!
    render_notice(t("successfully_created"))
  end

  def show
    authorize @post
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, :user_id, :organization_id, category_ids: [])
    end

    def load_post!
      @post = Post.find_by!(slug: params[:slug])
    end
end
