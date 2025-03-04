# frozen_string_literal: true

class Api::V1::UsersController < ApplicationController
  def index
    users = User.select(:id, :name)
    render status: :ok, json: { users: }
  end
end
