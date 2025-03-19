# frozen_string_literal: true

FactoryBot.define do
  factory :vote do
    post { nil }
    user { nil }
    vote_type { 1 }
  end
end
