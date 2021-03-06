Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    mount_devise_token_auth_for 'User', at: 'auth', skip: [:invitations]
    devise_for :users, path: "auth", only: [:invitations], controllers: { invitations: 'api/invitations' }
    resources :nodes
    resources :links
    resources :groups
    resources :users
    resources :workspaces
    resources :votes
    post '/nodes/create_node', to: 'nodes#create_node'
    patch '/nodes/:id/resolve', to: 'nodes#resolve_question'
    patch '/nodes/:id/unresolve', to: 'nodes#unresolve_question'
    post '/nodes/:id/vote', to: 'nodes#vote'
  end
  mount ActionCable.server => '/cable'
  root 'welcome#hello'
end
