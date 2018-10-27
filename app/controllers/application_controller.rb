class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

    def configure_permitted_parameters
      added_attrs = [:username, :email, :password, :password_confirmation, :remember_me]
      devise_parameter_sanitizer.permit :sign_up, keys: added_attrs
      devise_parameter_sanitizer.permit :account_update, keys: added_attrs
      devise_parameter_sanitizer.permit :accept_invitation, keys: [:email]
      devise_parameter_sanitizer.permit :invite, keys: [:group_id]
    end

    # def after_sign_in_path_for(resource)
    #   admin_root_path
    # end
    #
    # def after_sign_out_path_for(resource)
    #   new_user_session_path
    # end
    #
    # def after_invite_path_for(resource)
    #   admin_users_path
    # end
end
