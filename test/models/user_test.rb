# frozen_string_literal: true

require "test_helper"

class UserTest < ActiveSupport::TestCase
  def setup
    @organization = create(:organization)
    @user = build(:user, organization: @organization)
  end

  def test_user_should_not_be_valid_without_name
    @user.name = ""
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Name can't be blank"
  end

  def test_user_name_should_have_valid_length
    @user.name = "a" * (User::MAX_NAME_LENGTH + 1)
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Name is too long (maximum is #{User::MAX_NAME_LENGTH} characters)"
  end

  def test_user_should_not_be_valid_without_email
    @user.email = ""
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Email can't be blank"
  end

  def test_user_email_should_have_valid_length
    @user.email = "a" * (User::MAX_EMAIL_LENGTH + 1) + "@example.com"
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Email is too long (maximum is #{User::MAX_EMAIL_LENGTH} characters)"
  end

  def test_user_should_not_be_valid_with_invalid_email_format
    invalid_emails = [
      "user@example,com",
      "user_at_example.com",
      "user.name@example.",
      "user@example_domain.com",
      "user@.example.com",
      "user@example..com",
      "user@.com",
      "@example.com",
      "user@-example.com"
    ]

    invalid_emails.each do |invalid_email|
      @user.email = invalid_email
      assert_not @user.valid?, "#{invalid_email} should be invalid"
      assert_includes @user.errors.full_messages, "Email is not a valid email"
    end
  end

  def test_user_email_should_be_unique
    @user.save!
    duplicate_user = build(:user, email: @user.email.upcase)
    assert_not duplicate_user.valid?
    assert_includes duplicate_user.errors.full_messages, "Email has already been taken"
  end

  def test_user_should_not_be_valid_without_password
    user = build(:user, password: nil, password_confirmation: nil)
    assert_not user.valid?
    assert_includes user.errors.full_messages, "Password can't be blank"
  end

  def test_user_password_should_have_minimum_length
    @user.password = @user.password_confirmation = "a" * (User::MIN_PASSWORD_LENGTH - 1)
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Password is too short (minimum is #{User::MIN_PASSWORD_LENGTH} characters)"
  end

  def test_user_should_not_be_valid_without_password_confirmation_on_create
    user = build(:user, password_confirmation: nil)
    assert_not user.valid?
    assert_includes user.errors.full_messages, "Password confirmation can't be blank"
  end

  def test_user_should_not_be_valid_without_organization
    user = build(:user, :without_organization)
    assert_not user.valid?
    assert_includes user.errors.full_messages, "Organization can't be blank"
  end

  def test_user_should_have_created_at_and_updated_at
    @user.save!
    assert_not_nil @user.created_at
    assert_not_nil @user.updated_at
  end

  def test_factory_creates_valid_user
    user = create(:user)
    assert user.valid?
    assert user.persisted?
  end

  def test_user_can_have_posts
    user = create(:user, :with_posts)
    assert_equal 2, user.posts.count
  end

  def test_user_can_exist_without_posts
    user = create(:user)
    assert_equal 0, user.posts.count
  end

  def test_user_email_should_be_downcased_before_save
    mixed_case_email = "UsEr@ExAmPlE.CoM"
    @user.email = mixed_case_email
    @user.save
    assert_equal mixed_case_email.downcase, @user.reload.email
  end

  def test_user_should_generate_authentication_token_on_create
    @user.save
    assert_not_nil @user.authentication_token
  end

  def test_user_should_not_require_password_confirmation_on_update
    user = create(:user)
    user.update(name: "New Name")
    assert user.valid?
  end

  def test_user_should_not_allow_nil_password_on_update
    user = create(:user)
    result = user.update(password: nil)
    puts "Update result: #{result}, Errors: #{user.errors.full_messages}" unless result
    assert_not result
    assert_includes user.errors.full_messages, "Password can't be blank"
  end

  def test_user_should_validate_password_confirmation
    user = build(:user, password: "password123", password_confirmation: "different")
    assert_not user.valid?
    assert_includes user.errors.full_messages, "Password confirmation doesn't match Password"
  end

  def test_user_should_be_able_to_authenticate_with_correct_password
    user = create(:user, password: "password123")
    assert user.authenticate("password123")
  end

  def test_user_should_not_authenticate_with_incorrect_password
    user = create(:user, password: "password123")
    assert_not user.authenticate("wrongpassword")
  end
end
