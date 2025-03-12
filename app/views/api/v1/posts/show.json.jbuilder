# frozen_string_literal: true

json.post do
  json.extract! @post,
    :id,
    :title,
    :description,
    :upvotes,
    :downvotes,
    :is_bloggable,
    :slug,
    :created_at,
    :updated_at,
    :status

  json.user do
    json.extract! @post.user,
      :id,
      :name
  end

  json.categories @post.categories do |category|
    json.extract! category,
      :id,
      :name
  end
end
