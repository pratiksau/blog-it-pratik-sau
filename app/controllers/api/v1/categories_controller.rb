# frozen_string_literal: true

class Api::V1::CategoriesController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token
  def index
    if params[:search].present?
      @categories = Category.where("name #{Constants::LIKE_OPERATOR} ?", "%#{params[:search]}%")
    else
      @categories = Category.all
    end

    render :index
  end

  def create
    Category.create!(category_params)
    render_notice(t("successfully_created_category"))
  end

  private

    def category_params
      params.require(:category).permit(:name)
    end
end
