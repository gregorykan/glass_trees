Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      resources :nodes
      resources :links
      post '/nodes/question', to: 'nodes#create_question'
    end
  end
end
