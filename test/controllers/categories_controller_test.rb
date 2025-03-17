# frozen_string_literal: true

require "test_helper"

class Api::V1::CategoriesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @category1 = create(:category, name: "Sports")
    @category2 = create(:category, name: "News")
  end

  def test_index_returns_all_categories
    get api_v1_categories_path, as: :json
    assert_response :success

    response_json = response.parsed_body

    assert response_json["categories"].is_a?(Array)
    assert_equal Category.count, response_json["categories"].length
    response_json["categories"].each do |cat|

      assert_includes cat.keys, "id"
      assert_includes cat.keys, "name"
    end
  end

  def test_index_filters_categories_by_search
    create(:category, name: "Technology")
    create(:category, name: "Tech News")
    create(:category, name: "Cooking")

    get api_v1_categories_path, params: { search: "Tech" }, as: :json
    assert_response :success

    response_json = response.parsed_body
    categories = response_json["categories"]
    assert_equal 2, categories.length
    names = categories.map { |cat| cat["name"] }
    assert_includes names, "Technology"
    assert_includes names, "Tech News"
  end

  def test_create_creates_category_with_valid_params
    new_category_params = {
      category: {
        name: "Music"
      }
    }
    assert_difference "Category.count", 1 do
      post api_v1_categories_path, params: new_category_params, as: :json
    end

    assert_response :success
    response_json = response.parsed_body
    assert_equal I18n.t("successfully_created_category"), response_json["notice"]
  end

  def test_create_raises_error_with_invalid_params
    invalid_category_params = {
      category: {
        name: ""
      }
    }
    assert_no_difference "Category.count" do
      post api_v1_categories_path, params: invalid_category_params, as: :json
    end
    assert_response :unprocessable_entity
    response_json = response.parsed_body
    assert response_json["error"].present?
  end
end
