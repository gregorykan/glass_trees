# module Api
  class Api::NodesController < ApiController
    before_action :authenticate_api_user!
    before_action :set_node, only: [:show, :update, :destroy, :resolve_question, :unresolve_question]

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

    def create_node
      current_node = Node.find(params[:current_node_id])
      @node = Node.create!(create_node_params)
      if params[:node_creation_type] == 'clarifyingQuestion'
        current_node.precedent_questions << @node
      elsif params[:node_creation_type] == 'followUpQuestion'
        current_node.consequent_questions << @node
      else
        current_node.options << @node
      end
      if @node.errors.empty?
        render json: @node.to_json( :include => [:source_links, :target_links] ), status: :ok
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

    def resolve_question
      @node.resolved = true
      @node.save!
      @node.options.update_all(resolved: true)
      if @node.errors.empty?
        render json: @node.to_json( :include => [:options] ), status: :ok
      else
        render json: { errors: @node.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    def unresolve_question
      @node.resolved = false
      @node.save!
      @node.options.update_all(resolved: false)
      if @node.errors.empty?
        render json: @node.to_json( :include => [:options] ), status: :ok
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

    def create_node_params
      node_params.except(:current_node_id, :node_creation_type)
    end

    def node_params
      params.permit(:node_type, :label, :description, :current_node_id, :node_creation_type, :workspace_id, :user_id)
    end

    def set_node
      @node = Node.find(params[:id])
    end

  end
# end
