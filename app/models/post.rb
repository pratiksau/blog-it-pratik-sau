# frozen_string_literal: true

class Post < ApplicationRecord
  MAXIMUM_TITLE_LENGTH = 125
  MAXIMUM_DESCRIPTION_LENGTH = 10000

  validates :title, presence: true, length: { maximum: MAXIMUM_TITLE_LENGTH }
  validates :description, presence: true, length: { maximum: MAXIMUM_DESCRIPTION_LENGTH }
  validates_inclusion_of :is_bloggable, in: [true, false]
end
