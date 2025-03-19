# frozen_string_literal: true

class Api::V1::VotesController < ApplicationController
  before_action :authenticate_user_using_x_auth_token
  before_action :set_post

  def upvote
    @post.vote_by(current_user, :upvote)
    render_post
  end

  def downvote
    @post.vote_by(current_user, :downvote)
    render_post
  end

  private

    def set_post
      @post = Post.find_by!(slug: params[:slug])
    end

    def render_post
      render "api/v1/posts/show", status: :ok
    end
end
