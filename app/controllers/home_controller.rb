# frozen_string_literal: true

class HomeController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token
  def index
    respond_to do |format|
      format.html # renders the default view
      format.json { render json: { error: "API endpoints are at /api/v1/" }, status: :not_found }
    end
  end
end
