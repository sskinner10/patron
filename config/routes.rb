Rails.application.routes.draw do
  root 'homes#index'
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get "/reviews/new", to: "static_pages#index"

  resources :homes, only: [:index]

  namespace :api do
    namespace :v1 do
      resources :reviews, only: [:create]
    end
  end
end
