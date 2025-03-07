# frozen_string_literal: true

require "test_helper"

class OrganizationTest < ActiveSupport::TestCase
  def setup
    @organization = build(:organization)
  end

  def test_organization_should_not_be_valid_without_name
    @organization.name = ""
    assert_not @organization.valid?
    assert_includes @organization.errors.full_messages, "Name can't be blank"
  end

  def test_organization_name_should_be_unique
    @organization.save!
    duplicate_organization = build(:organization, name: @organization.name)
    assert_not duplicate_organization.valid?
    assert_includes duplicate_organization.errors.full_messages, "Name has already been taken"
  end

  def test_organization_name_should_have_valid_length
    @organization.name = "a" * 101
    assert_not @organization.valid?
    assert_includes @organization.errors.full_messages, "Name is too long (maximum is 100 characters)"
  end

  def test_organization_should_have_created_at_and_updated_at
    @organization.save!
    assert_not_nil @organization.created_at
    assert_not_nil @organization.updated_at
  end

  def test_factory_creates_valid_organization
    organization = create(:organization)
    assert organization.valid?
    assert organization.persisted?
  end

  def test_organization_can_have_users
    organization = create(:organization)
    user = create(:user, organization: organization)
    assert_equal 1, organization.users.count
    assert_includes organization.users, user
  end

  def test_organization_can_exist_without_users
    organization = create(:organization)
    assert_equal 0, organization.users.count
  end

  def test_organization_can_have_posts
    organization = create(:organization)
    post = create(:post, organization: organization)
    assert_equal 1, organization.posts.count
    assert_includes organization.posts, post
  end

  def test_organization_can_exist_without_posts
    organization = create(:organization)
    assert_equal 0, organization.posts.count
  end

  def test_organization_name_should_be_case_sensitive_unique
    @organization.name = "Test Organization"
    @organization.save!
    duplicate_organization = build(:organization, name: "test organization")
    assert duplicate_organization.valid?
  end

  def test_organization_can_be_associated_with_multiple_users
    organization = create(:organization)
    user1 = create(:user, organization: organization)
    user2 = create(:user, organization: organization)
    assert_equal 2, organization.users.count
    assert_includes organization.users, user1
    assert_includes organization.users, user2
  end

  def test_organization_can_be_associated_with_multiple_posts
    organization = create(:organization)
    post1 = create(:post, organization: organization)
    post2 = create(:post, organization: organization)
    assert_equal 2, organization.posts.count
    assert_includes organization.posts, post1
    assert_includes organization.posts, post2
  end
end
