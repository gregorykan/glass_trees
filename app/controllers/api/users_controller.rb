# module Api
  class Api::UsersController < ApiController
    before_action :authenticate_api_user!
    before_action :set_user, only: [:show, :update, :destroy]

    # GET /users
    def index
      @users = User.all
      render :json => @users
    end

    # GET /users/:id
    def show
      render :json => @user
    end

    # POST /users
    def create
      @user = User.create!(user_params)
      if @user.errors.empty?
        render json: @user, status: :ok
      else
        render json: { errors: @user.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    # PUT /users/:id
    def update
      @user.update(user_params)
      if @user.errors.empty?
        render json: @user, status: :ok
      else
        render json: { errors: @user.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    # DELETE /users/:id
    def destroy
      @user.destroy
      head :no_content
    end

    private

    def user_params
      params.permit(:user_type)
    end

    def set_user
      @user = User.find(params[:id])
    end

  end
# end
