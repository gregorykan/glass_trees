module Api::V1
  class GroupsController < ApiController
    before_action :set_group, only: [:show, :update, :destroy]

    # GET /groups
    def index
      @groups = Group.all
      render :json => @groups
    end

    # GET /groups/:id
    def show
      render :json => @group
    end

    # POST /groups
    def create
      @group = Group.create!(group_params)
      if @group.errors.empty?
        render json: @group, status: :ok
      else
        render json: { errors: @group.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    # PUT /groups/:id
    def update
      @group.update(group_params)
      if @group.errors.empty?
        render json: @group, status: :ok
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
      params.permit(:group_type)
    end

    def set_group
      @group = Group.find(params[:id])
    end

  end
end
