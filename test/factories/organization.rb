# frozen_string_literal: true

FactoryBot.define do
  factory :organization do
    name { Faker::Company.unique.name }

    trait :with_users do
      after(:create) do |organization|
        create_list(:user, 2, organization: organization)
      end
    end

    trait :with_posts do
      after(:create) do |organization|
        create_list(:post, 2, organization: organization)
      end
    end
  end
end
