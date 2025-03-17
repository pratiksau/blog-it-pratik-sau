# frozen_string_literal: true

require "test_helper"

class Api::V1::OrganizationsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @org1 = create(:organization, name: "Org1")
    @org2 = create(:organization, name: "Org2")
  end

  def test_index_returns_all_organizations
    get api_v1_organizations_path, as: :json
    assert_response :success

    response_json = response.parsed_body
    organizations = response_json["organizations"]

    # Ensure we get an array back and the count matches the Organization count in our test database.
    assert organizations.is_a?(Array)
    assert_equal Organization.count, organizations.length

    # Each organization should only include id and name.
    organizations.each do |org|
      assert_equal ["id", "name"].sort, org.keys.sort
    end
  end

  def test_index_returns_empty_array_when_no_organizations_exist
    Organization.destroy_all
    get api_v1_organizations_path, as: :json
    assert_response :success

    response_json = response.parsed_body
    assert_equal [], response_json["organizations"]
  end
end
