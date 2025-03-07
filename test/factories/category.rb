# frozen_string_literal: true

FactoryBot.define do
  factory :category do
    name { Faker::Lorem.unique.word }

    trait :with_posts do
      after(:create) do |category|
        category.posts << create_list(:post, 2)
      end
    end
  end
end
