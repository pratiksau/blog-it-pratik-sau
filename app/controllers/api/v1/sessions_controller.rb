# frozen_string_literal: true

class Api::V1::SessionsController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token, only: [:create]

  def create
    @user = User.find_by(email: login_params[:email].downcase)
    if @user&.authenticate(login_params[:password])
      # Include authentication_token in the response
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
