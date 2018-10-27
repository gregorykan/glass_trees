module Api::V1
  class GroupsController < ApiController
    before_action :authenticate_api_v1_user! # GK: NB: i have no idea https://github.com/lynndylanhurley/devise_token_auth/issues/219
    before_action :set_group, only: [:show, :update, :destroy]

    # GET /groups
    def index
      @group = Group.where(id: current_api_v1_user.group_id).first || nil
      render :json => @group.to_json, status: :ok
    end

    # GET /groups/:id
    def show
      render :json => @group.to_json, status: :ok
    end

    # POST /groups
    def create
      # @group = Group.create!(group_params)
      @group = Group.create_and_update_creator(group_params, current_api_v1_user)
      if @group.errors.empty?
        current_api_v1_user.group = @group
        current_api_v1_user.save!
        render json: @group.to_json, status: :ok
      else
        render json: { errors: @group.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    # PUT /groups/:id
    def update
      @group.update(group_params)
      if @group.errors.empty?
        render json: @group.to_json, status: :ok
      else
        render json: { errors: @group.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    # DELETE /groups/:id
    def destroy
      @group.destroy
      head :no_content
    end

    private

    def group_params
      params.permit(:name)
    end

    def set_group
      @group = Group.find(params[:id])
    end

  end
end
