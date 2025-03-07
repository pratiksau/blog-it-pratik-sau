# frozen_string_literal: true

class Organization < ApplicationRecord
  MAX_NAME_LENGTH = 100
  has_many :users
  has_many :posts
  validates :name, presence: true, uniqueness: true, length: { maximum: MAX_NAME_LENGTH }
end
