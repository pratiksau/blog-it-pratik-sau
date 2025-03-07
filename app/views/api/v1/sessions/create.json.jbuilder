# frozen_string_literal: true

json.extract! @user,
  :id,
  :name,
  :email,
  :authentication_token
