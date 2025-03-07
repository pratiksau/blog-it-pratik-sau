# frozen_string_literal: true

require "test_helper"

class PostTest < ActiveSupport::TestCase
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @post = build(:post, user: @user, organization: @organization)
  end

  def test_post_should_not_be_valid_without_title
    @post.title = ""
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Title can't be blank"
  end

  def test_post_title_should_have_valid_length
    @post.title = "a" * (Post::MAXIMUM_TITLE_LENGTH + 1)
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Title is too long (maximum is #{Post::MAXIMUM_TITLE_LENGTH} characters)"
  end

  def test_post_should_not_be_valid_without_description
    @post.description = ""
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Description can't be blank"
  end

  def test_post_description_should_have_valid_length
    @post.description = "a" * (Post::MAXIMUM_DESCRIPTION_LENGTH + 1)
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Description is too long (maximum is #{Post::MAXIMUM_DESCRIPTION_LENGTH} characters)"
  end

  def test_post_should_not_be_valid_without_is_bloggable
    @post.is_bloggable = nil
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Is bloggable is not included in the list"
  end

  def test_post_should_not_be_valid_without_user
    @post.user = nil
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "User must exist"
  end

  def test_post_should_not_be_valid_without_organization
    @post.organization = nil
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Organization must exist"
  end

  def test_post_should_have_created_at_and_updated_at
    @post.save!
    assert_not_nil @post.created_at
    assert_not_nil @post.updated_at
  end

  def test_factory_creates_valid_post
    post = create(:post)
    assert post.valid?
    assert post.persisted?
  end

  def test_post_can_have_categories
    post = create(:post)
    category = create(:category)
    post.categories << category
    assert_equal 1, post.categories.count
    assert_includes post.categories, category
  end

  def test_post_can_exist_without_categories
    post = create(:post)
    assert_equal 0, post.categories.count
  end

  def test_post_slug_should_be_set_before_create
    post = create(:post, title: "Test Post Title")
    assert_not_nil post.slug
    assert_equal "test-post-title", post.slug
  end

  def test_post_slug_should_be_unique
    post1 = create(:post, title: "Test Post Title")
    post2 = create(:post, title: "Test Post Title")
    assert_not_equal post1.slug, post2.slug
    assert_equal "test-post-title-2", post2.slug
  end

  def test_post_slug_should_not_be_changed_after_creation
    post = create(:post)
    original_slug = post.slug
    post.slug = "new-slug"
    assert_not post.valid?
    assert_includes post.errors[:slug], "is immutable!"
  end

  def test_post_upvotes_should_have_default_value
    post = create(:post)
    assert_equal 0, post.upvotes
  end

  def test_post_downvotes_should_have_default_value
    post = create(:post)
    assert_equal 0, post.downvotes
  end

  def test_post_can_be_associated_with_multiple_categories
    post = create(:post)
    category1 = create(:category)
    category2 = create(:category)
    post.categories << category1
    post.categories << category2
    assert_equal 2, post.categories.count
    assert_includes post.categories, category1
    assert_includes post.categories, category2
  end

  def test_post_should_have_unique_slug_with_multiple_posts_with_same_title
    post1 = create(:post, title: "Test Post Title")
    post2 = create(:post, title: "Test Post Title")
    post3 = create(:post, title: "Test Post Title")

    assert_equal "test-post-title", post1.slug
    assert_equal "test-post-title-2", post2.slug
    assert_equal "test-post-title-3", post3.slug
  end

  def test_post_should_allow_valid_is_bloggable_values
    post1 = create(:post, is_bloggable: true)
    post2 = create(:post, is_bloggable: false)

    assert post1.valid?
    assert post2.valid?
  end
end
