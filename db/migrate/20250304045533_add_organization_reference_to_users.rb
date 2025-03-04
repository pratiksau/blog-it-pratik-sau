# frozen_string_literal: true

class AddOrganizationReferenceToUsers < ActiveRecord::Migration[7.1]
  def change
    add_reference :users, :organization, null: false, foreign_key: true
  end
end
