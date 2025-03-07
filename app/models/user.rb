# frozen_string_literal: true

class User < ApplicationRecord
  MIN_PASSWORD_LENGTH = 8
  MAX_NAME_LENGTH = 50
  MAX_EMAIL_LENGTH = 255
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d](?:[a-z\d-]*[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]*[a-z\d])?)*\.[a-z]+\z/i

  belongs_to :organization, foreign_key: :organization_id

  has_many :posts
  has_secure_password
  has_secure_token :authentication_token

  validates :organization_id, presence: true

  validates :name, presence: true, length: { maximum: MAX_NAME_LENGTH }

  validates :email, presence: true, uniqueness: { case_sensitive: false },
    format: { with: VALID_EMAIL_REGEX, message: "is not a valid email" },
    length: { maximum: MAX_EMAIL_LENGTH }

  validates :password, presence: true, length: { minimum: MIN_PASSWORD_LENGTH }, allow_nil: true
  validates :password_confirmation, presence: true, on: :create

  before_save :to_lower_case

  private

    def to_lower_case
      email.downcase!
    end
end
