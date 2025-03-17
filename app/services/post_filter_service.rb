# frozen_string_literal: true

class PostFilterService
  attr_reader :posts, :params

  def initialize(posts, params)
    @posts = posts
    @params = params
  end

  def filter
    filter_by_search
    filter_by_categories
    filter_by_status

    posts
  end

  private

    def filter_by_search
      return unless params[:search].present?

      @posts = posts.where("title LIKE ?", "%#{params[:search]}%")
    end

    def filter_by_categories
      return unless params[:category_ids].present?

      category_ids = params[:category_ids].split(",")
      post_ids = Post.joins(:categories)
        .where(categories: { id: category_ids })
        .distinct
        .pluck(:id)

      @posts = posts.where(id: post_ids)
    end

    def filter_by_status
      return unless params[:status].present?

      @posts = posts.where(status: params[:status])
    end
end
