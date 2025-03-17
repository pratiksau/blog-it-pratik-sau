# frozen_string_literal: true

class Api::V1::SessionsController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token, only: [:create, :destroy]

  def create
    @user = User.find_by(email: login_params[:email].downcase)
    if @user&.authenticate(login_params[:password])

    else
      render_error("Invalid email or password", :unauthorized)
    end
  end

  def destroy
    @current_user = nil
  end

  private

    def login_params
      params.require(:login).permit(:email, :password)
    end
end
