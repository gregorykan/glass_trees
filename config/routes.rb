Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      mount_devise_token_auth_for 'User', at: 'auth'
      resources :nodes
      resources :links
      post '/nodes/create_node', to: 'nodes#create_node'
      patch '/nodes/:id/resolve', to: 'nodes#resolve_question'
      patch '/nodes/:id/unresolve', to: 'nodes#unresolve_question'
    end
  end
end
