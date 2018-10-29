class Api::NodesController < ApiController
  before_action :authenticate_api_user!
  before_action :set_node, only: [:show, :update, :destroy, :resolve_question, :unresolve_question, :vote]

  # GET /nodes
  def index
    @nodes = Node.where(workspace_id: Workspace.where(group_id: current_api_user.group))
    # GK: TODO: request for votes separately because this is a lot of queries to the db
    render :json => @nodes.to_json( :include => [:upvotes, :downvotes] ), status: :ok
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
    if current_api_user.id != @node.user_id
      render json: { errors: ["Only the node's creator can resolve it."]}, status: :forbidden
      return
    end
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

  def vote
    existing_vote = @node.votes.where(user_id: params[:user_id]).first
    # user has already voted the same way, so destroy vote to 'undo'
    if (existing_vote.present?) && (existing_vote.is_upvote == params[:is_upvote])
      existing_vote.destroy!
      render json: @node.to_json( :include => [:upvotes, :downvotes] )
      return
    end

    # user has already voted but in the opposite way, so destroy existing vote and create a new one
    if (existing_vote.present?) && (existing_vote.is_upvote != params[:is_upvote])
      existing_vote.destroy!
    end

    # user has not previously voted for this node
    vote = Vote.new(create_vote_params)
    vote.node_id = @node.id
    @node.votes << vote
    render json: @node.to_json( :include => [:upvotes, :downvotes] )
  end

  # DELETE /nodes/:id
  def destroy
    @node.destroy
    head :no_content
  end

  private

  def create_vote_params
    node_params.except(:node_type, :label, :description, :node_creation_type, :workspace_id, :current_node_id)
  end

  def create_node_params
    node_params.except(:current_node_id, :node_creation_type, :is_upvote)
  end

  def node_params
    params.permit(:node_type, :label, :description, :current_node_id, :node_creation_type, :workspace_id, :user_id, :is_upvote)
  end

  def set_node
    @node = Node.find(params[:id])
  end

end
