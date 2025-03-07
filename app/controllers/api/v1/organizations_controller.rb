# frozen_string_literal: true

class Api::V1::OrganizationsController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token
  def index
    organizations = Organization.select(:id, :name)
    render json: { organizations: organizations }
  end
end
