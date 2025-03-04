# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  def index
    posts = Post.all
    render status: :ok, json: { posts: }
  end

  def create
    post = Post.new(post_params)
    post.save!
    render_notice(t("successfully_created"))
  end

  def show
    post = Post.find_by!(slug: params[:slug])
    render_json({ post: })
  end

  private

    def post_params
      params.require(:post).permit(:title, :description)
    end
end
