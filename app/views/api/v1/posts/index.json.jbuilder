# frozen_string_literal: true

json.posts @posts do |post|
  json.extract! post,
    :id,
    :title,
    :description,
    :upvotes,
    :downvotes,
    :is_bloggable,
    :slug,
    :created_at,
    :updated_at

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
end
