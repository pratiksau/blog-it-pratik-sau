# frozen_string_literal: true

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  namespace :api do
    namespace :v1 do
      constraints(lambda { |req| req.format == :json }) do
        resources :posts, except: %i[new edit], param: :slug do
          member do
            resource :report, only: %i[create], module: :posts do
              get :download
            end
            post "upvote", to: "votes#upvote"
            post "downvote", to: "votes#downvote"
          end
          collection do
            get :user_posts
            patch :bulk_update
            delete :bulk_destroy
          end
        end
        resources :users, only: %i[index create show]
        resources :categories, only: %i[index create]
        resources :organizations, only: %i[index]
        resource :sessions, only: %i[create destroy]
      end
    end
  end

  # Only serve the home#index route for HTML requests
  root "home#index"
  get "*path", to: "home#index", via: :all, constraints: { format: :html }
end
