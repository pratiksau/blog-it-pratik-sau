# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    email { Faker::Internet.unique.email }
    password { "password123" }
    password_confirmation { "password123" }
    association :organization, factory: :organization

    trait :with_posts do
      after(:create) do |user|
        create_list(:post, 2, user: user)
      end
    end

    trait :without_organization do
      organization { nil }
    end

    trait :with_invalid_password do
      password { "short" }
      password_confirmation { "short" }
    end
  end
end
