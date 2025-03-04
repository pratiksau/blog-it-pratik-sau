# frozen_string_literal: true

class User < ApplicationRecord
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

  belongs_to :organization, foreign_key: :organization_id

  has_many :posts
  validates :organization_id, presence: true

  validates :name, presence: true, length: { maximum: 50 }

  validates :email, presence: true, uniqueness: true,
    format: { with: VALID_EMAIL_REGEX, message: "is not a valid email" }

  has_secure_password
  validates :password, presence: true, length: { minimum: 8 }, allow_nil: true
end
