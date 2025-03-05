# frozen_string_literal: true

class Api::V1::CategoriesController < ApplicationController
  def index
    if params[:search].present?
      categories = Category.where("name LIKE ?", "%#{params[:search]}%")
    else
      categories = Category.all
    end
    render status: :ok, json: { categories: }
  end

  def create
    category = Category.create!(category_params)
    render_notice(t("successfully_created_category"))
  end

  private

    def category_params
      params.require(:category).permit(:name)
    end
end
