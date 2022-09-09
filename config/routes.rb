Rails.application.routes.draw do
  root 'homes#index'
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get "/reviews/new", to: "static_pages#index"
  get "/users/:id", to: "static_pages#index"
  get "/restaurants/recommendation", to: "static_pages#index"
  get "/restaurants/your-recommendation", to: "static_pages#index"
  get "/restaurants/:place_id", to: "static_pages#index"

  resources :homes, only: [:index]

  namespace :api do
    namespace :v1 do
      resources :reviews, only: [:create]
      resources :users, only: [:show]
      resources :restaurants, only: [:show]
      resources :categories, only: [:index]
      resources :recommendations, only: [:create]
    end
  end
end
