module Api
  class InvitationsController < Devise::InvitationsController
    include DeviseTokenAuth::Concerns::SetUserByToken
    include InvitableMethods
    before_action :authenticate_api_user!, only: :create
    before_action :resource_from_invitation_token, only: [:edit, :update]

    def create
      @user = User.invite!(invite_params, current_api_user)
      @user.group_id = current_api_user.group_id
      @user.save
      if @user.errors.empty?
        render json: { success: ['User invited.'] }, status: :ok
      else
        render json: { errors: @user.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    def update
      @user = User.accept_invitation!(accept_invitation_params)
      if @user.errors.empty?
        render json: @user, status: :ok
      else
        render json: { errors: @user.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    protected
    def resource_from_invitation_token
      unless params[:invitation_token] && User.find_by_invitation_token(params[:invitation_token], true)
        render json: { errors: user.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    private

    def invite_params
      params.permit(:email, :invitation_token, :provider, :skip_invitation)
    end

    def accept_invitation_params
      params.permit(:password, :password_confirmation, :invitation_token)
    end
  end
end
