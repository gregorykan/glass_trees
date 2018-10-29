class Api::VotesController < ApiController
  before_action :authenticate_api_user!
  before_action :set_vote, only: [:show, :update, :destroy]

  # GET /votes
  def index
    @votes = Vote.where(user_id: User.where(group_id: current_api_user.group_id))
    render :json => @votes
  end

  # GET /votes/:id
  def show
    render :json => @vote
  end

  # POST /votes
  def create
    @vote = Vote.create!(vote_params)
    if @vote.errors.empty?
      render json: @vote, status: :ok
    else
      render json: { errors: @vote.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  # PUT /votes/:id
  def update
    @vote.update(vote_params)
    if @vote.errors.empty?
      render json: @vote, status: :ok
    else
      render json: { errors: @vote.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  # DELETE /votes/:id
  def destroy
    @vote.destroy
    head :no_content
  end

  private

  def vote_params
    params.permit(:vote_type)
  end

  def set_vote
    @vote = Vote.find(params[:id])
  end

end
