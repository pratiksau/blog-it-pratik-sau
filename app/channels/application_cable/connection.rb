# frozen_string_literal: true

module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
      logger.add_tags "ActionCable", current_user.email
    end

    private

      def find_verified_user
        user_email = request.headers["X-Auth-Email"] ||
                    request.query_parameters[:email]
        auth_token = request.headers["X-Auth-Token"] ||
                    request.query_parameters[:auth_token]

        if user_email.present? && auth_token.present?
          user = User.find_by(email: user_email)
          if user && user.authentication_token == auth_token
            return user
          end
        end

        # Rails.logger.error("ActionCable: Failed authentication attempt from #{request.remote_ip}")
        reject_unauthorized_connection
      end
  end
end
