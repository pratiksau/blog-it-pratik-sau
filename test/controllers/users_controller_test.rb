# frozen_string_literal: true

require "test_helper"

class Api::V1::UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    # Create an authenticated user to be used for actions that require authentication.
    @authenticated_user = create(
      :user,
      organization: @organization,
      password: "password",
      password_confirmation: "password"
    )
  end

  def test_index_returns_users_list
    # Create additional users to appear in the index list.
    create(
      :user,
      organization: @organization,
      password: "password",
      password_confirmation: "password",
      name: "Alice"
    )
    create(
      :user,
      organization: @organization,
      password: "password",
      password_confirmation: "password",
      name: "Bob"
    )

    # The index action uses authentication, so provide valid headers.
    get api_v1_users_path, headers: headers(@authenticated_user)
    assert_response :ok

    response_json = response.parsed_body
    # The controller selects only id and name; ensure that an Array is returned.
    assert response_json["users"].is_a?(Array)

    names = response_json["users"].map { |u| u["name"] }
    assert_includes names, "Alice"
    assert_includes names, "Bob"
  end

  def test_create_creates_a_new_user
    new_user_params = {
      user: {
        name: "Charlie",
        email: "charlie@example.com",
        password: "password123",
        password_confirmation: "password123",
        organization_id: @organization.id
      }
    }
    # Create action does not require prior authentication.
    assert_difference "User.count", 1 do
      post api_v1_users_path, params: new_user_params, as: :json
    end

    assert_response :success
    response_json = response.parsed_body
    # The controller renders a notice after successful creation.
    assert_equal "User was successfully created", response_json["notice"]
  end

  def test_show_returns_user_details
    user = create(
      :user,
      organization: @organization,
      password: "password",
      password_confirmation: "password",
      name: "Dave",
      email: "dave@example.com"
    )

    get api_v1_user_path(user), headers: headers(@authenticated_user)
    assert_response :ok

    response_json = response.parsed_body
    returned_user = response_json["user"]
    assert_equal user.id, returned_user["id"]
    assert_equal user.name, returned_user["name"]
    assert_equal user.email, returned_user["email"]
    assert_equal user.organization_id, returned_user["organization_id"]
    assert_equal ["id", "name", "email", "organization_id"].sort, returned_user.keys.sort
  end

  def test_show_returns_not_found_when_user_does_not_exist
    get api_v1_user_path(-1), headers: headers(@authenticated_user)
    assert_response :not_found
    response_json = response.parsed_body
  end
end
