module Api
  class WorkspacesController < ApiController
    before_action :authenticate_api_user!
    before_action :set_workspace, only: [:show, :update, :destroy]

    # GET /workspaces
    def index
      @workspaces = Workspace.where(group_id: current_api_user.group_id)
      render :json => @workspaces
    end

    # GET /workspaces/:id
    def show
      render :json => @workspace
    end

    # POST /workspaces
    def create
      @workspace = Workspace.create!(workspace_params)
      if @workspace.errors.empty?
        render json: @workspace, status: :ok
      else
        render json: { errors: @workspace.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    # PUT /workspaces/:id
    def update
      @workspace.update(workspace_params)
      if @workspace.errors.empty?
        render json: @workspace, status: :ok
      else
        render json: { errors: @workspace.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    # DELETE /workspaces/:id
    def destroy
      @workspace.destroy
      head :no_content
    end

    private

    def workspace_params
      params.permit(:name, :group_id)
    end

    def set_workspace
      @workspace = Workspace.find(params[:id])
    end

  end
end
