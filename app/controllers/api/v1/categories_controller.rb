# frozen_string_literal: true

class Api::V1::CategoriesController < ApplicationController
  def index
    categories = Category.all
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
