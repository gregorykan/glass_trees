module Api::V1
  class NodesController < ApiController
    before_action :set_node, only: [:show, :update, :destroy]

    # GET /nodes
    def index
      @nodes = Node.all
      render :json => @nodes
    end

    # GET /nodes/:id
    def show
      render :json => @node
    end

    # POST /nodes
    def create
      @node = Node.create!(node_params)
      if @node.errors.empty?
        render json: @node, status: :ok
      else
        render json: { errors: @node.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    # PUT /nodes/:id
    def update
      @node.update(node_params)
      if @node.errors.empty?
        render json: @node, status: :ok
      else
        render json: { errors: @node.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    # DELETE /nodes/:id
    def destroy
      @node.destroy
      head :no_content
    end

    private

    def node_params
      params.permit(:node_type)
    end

    def set_node
      @node = Node.find(params[:id])
    end

  end
end
