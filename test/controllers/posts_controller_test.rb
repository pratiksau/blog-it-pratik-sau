# frozen_string_literal: true

require "test_helper"

class Api::V1::PostsControllerTest < ActionDispatch::IntegrationTest
  include ActionView::Helpers::TranslationHelper

  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @post = create(:post, user: @user, organization: @organization)
    @category = create(:category)
    @headers = headers(@user)
  end

  def test_should_list_all_posts
    get api_v1_posts_path, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_equal Post.count, response_json["posts"].length
  end

  def test_should_filter_posts_by_categories
    post_with_category = create(:post, user: @user, organization: @organization)
    post_with_category.categories << @category

    get api_v1_posts_path, params: { category_ids: @category.id }, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_equal 1, response_json["posts"].length
  end

  def test_should_create_valid_post
    post_params = {
      post: {
        title: "Test post",
        description: "Test description",
        user_id: @user.id,
        is_bloggable: true,
        category_ids: [@category.id]
      }
    }

    assert_difference "Post.count" do
      post api_v1_posts_path, params: post_params, headers: @headers
    end

    assert_response :success
    response_json = response.parsed_body
    assert_equal I18n.t("successfully_created"), response_json["notice"]
  end

  def test_should_show_post
    get api_v1_post_path(@post.slug), headers: @headers
    assert_response :success
  end

  def test_should_update_post
    update_params = {
      post: {
        title: "Updated title",
        description: "Updated description"
      }
    }

    put api_v1_post_path(@post.slug), params: update_params, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_equal I18n.t("successfully_updated"), response_json["notice"]
    @post.reload
    assert_equal "Updated title", @post.title
  end

  def test_should_update_post_silently_with_quiet_param
    update_params = {
      post: {
        title: "Updated title"
      },
      quiet: true
    }

    put api_v1_post_path(@post.slug), params: update_params, headers: @headers
    assert_response :success
    assert_empty response.body
  end

  def test_should_not_update_organization_id
    original_org_id = @post.organization_id
    update_params = {
      post: {
        organization_id: create(:organization).id
      }
    }

    put api_v1_post_path(@post.slug), params: update_params, headers: @headers
    assert_response :success
    @post.reload
    assert_equal original_org_id, @post.organization_id
  end

  def test_should_destroy_post
    assert_difference "Post.count", -1 do
      delete api_v1_post_path(@post.slug), headers: @headers
    end

    assert_response :success
    response_json = response.parsed_body
    assert_equal I18n.t("successfully_deleted"), response_json["notice"]
  end

  def test_should_list_user_posts
    another_user = create(:user, organization: @organization)
    create(:post, user: another_user, organization: @organization)
    create(:post, user: @user, organization: @organization)

    get user_posts_api_v1_posts_path, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_equal @user.posts.count, response_json["posts"].length
  end

  def test_should_not_create_post_without_title
    post_params = {
      post: {
        description: "Test description",
        user_id: @user.id,
        organization_id: @organization.id
      }
    }

    assert_no_difference "Post.count" do
      post api_v1_posts_path, params: post_params, headers: @headers
    end

    assert_response :unprocessable_entity
  end

  def test_should_not_show_non_existent_post
    get api_v1_post_path("non-existent-slug"), headers: @headers
    assert_response :not_found
  end

  def test_should_not_update_non_existent_post
    put api_v1_post_path("non-existent-slug"), params: { post: { title: "New title" } }, headers: @headers
    assert_response :not_found
  end

  def test_should_not_destroy_non_existent_post
    assert_no_difference "Post.count" do
      delete api_v1_post_path("non-existent-slug"), headers: @headers
    end
    assert_response :not_found
  end

  def test_should_authorize_post_actions
    different_org = create(:organization)
    unauthorized_user = create(:user, organization: different_org)
    unauthorized_headers = headers(unauthorized_user)

    # Test unauthorized create: send a user_id that does not match current_user's id.
    post_params = {
      post: {
        title: "Test post",
        description: "Test description",
        user_id: @user.id, # intentionally not matching unauthorized_user.id
        is_bloggable: true
      }
    }

    assert_no_difference "Post.count" do
      post api_v1_posts_path, params: post_params, headers: unauthorized_headers
    end
    assert_response :forbidden

    # Test unauthorized update
    put api_v1_post_path(@post.slug),
      params: { post: { title: "New title" } },
      headers: unauthorized_headers
    assert_response :forbidden

    # Test unauthorized destroy
    assert_no_difference "Post.count" do
      delete api_v1_post_path(@post.slug), headers: unauthorized_headers
    end
    assert_response :forbidden
  end
end
