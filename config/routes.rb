Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      resources :nodes
      resources :links
      post '/nodes/create_node', to: 'nodes#create_node'
      patch '/nodes/:id/resolve', to: 'nodes#resolve_question'
    end
  end
end
