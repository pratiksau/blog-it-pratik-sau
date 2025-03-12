# frozen_string_literal: true

class PostPolicy
  attr_reader :user, :post

  def initialize(user, post)
    @user = user
    @post = post
  end

  def index?
    true
  end

  def show?
    user.organization_id == post.organization_id
  end

  def create?
    true
  end

  def update?
    edit?
  end

  def edit?
    post.user_id == user.id
  end

  def destroy?
    post.user_id == user.id
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.where(organization_id: user.organization_id)
        .where("user_id = ? OR status = ?", user.id, "published")
    end
  end
end
