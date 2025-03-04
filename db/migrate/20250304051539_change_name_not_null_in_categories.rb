# frozen_string_literal: true

class ChangeNameNotNullInCategories < ActiveRecord::Migration[7.1]
  def change
    change_column_null :categories, :name, false
  end
end
