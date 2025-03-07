# frozen_string_literal: true

FactoryBot.define do
  factory :post do
    title { Faker::Lorem.sentence }
    description { Faker::Lorem.paragraph }
    upvotes { 0 }
    downvotes { 0 }
    is_bloggable { false }
    association :organization, factory: :organization
    association :user, factory: :user

    trait :with_categories do
      after(:create) do |post|
        post.categories << create_list(:category, 2)
      end
    end

    trait :bloggable do
      is_bloggable { true }
    end

    trait :with_votes do
      upvotes { Faker::Number.between(from: 1, to: 100) }
      downvotes { Faker::Number.between(from: 1, to: 100) }
    end
  end
end
