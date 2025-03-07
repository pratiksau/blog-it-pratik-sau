# frozen_string_literal: true

class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token, only: [:create]
  def index
    users = User.select(:id, :name)
    render status: :ok, json: { users: }
  end

  def create
    user = User.new(user_params)
    user.save!
    render_notice("User was successfully created")
  end

  def show
    user = User.find(params[:id])
    render status: :ok, json: { user: user.as_json(only: [:id, :name, :email, :organization_id]) }
  end

  private

    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :organization_id)
    end
end
