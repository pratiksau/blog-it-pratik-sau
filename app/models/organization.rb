# frozen_string_literal: true

class Organization < ApplicationRecord
  has_many :users
  has_many :posts
  validates :name, presence: true
end
