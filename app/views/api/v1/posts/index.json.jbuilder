# frozen_string_literal: true

json.posts @posts do |post|
  json.extract! post,
    :id,
    :title,
    :description,
    :upvotes,
    :downvotes,
    :votes_count,
    :is_bloggable,
    :slug,
    :created_at,
    :updated_at,
    :status

  json.user do
    json.extract! post.user,
      :id,
      :name
  end

  json.categories post.categories do |category|
    json.extract! category,
      :id,
      :name
  end

  if defined?(current_user) && current_user
    json.user_vote do
      json.upvoted post.upvoted_by?(current_user)
      json.downvoted post.downvoted_by?(current_user)
    end
  end
end
