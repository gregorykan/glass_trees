module Api
  class LinksController < ApiController
    before_action :set_link, only: [:show, :update, :destroy]

    # GET /links
    def index
      @links = Link.all
      render :json => @links
    end

    # GET /links/:id
    def show
      render :json => @link
    end

    # POST /links
    def create
      @link = Link.create!(link_params)
      if @link.errors.empty?
        render json: @link, status: :ok
      else
        render json: { errors: @link.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    # PUT /links/:id
    def update
      @link.update(link_params)
      if @link.errors.empty?
        render json: @link, status: :ok
      else
        render json: { errors: @link.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    # DELETE /links/:id
    def destroy
      @link.destroy
      head :no_content
    end

    private

    def link_params
      params.permit(:link_type)
    end

    def set_link
      @link = Link.find(params[:id])
    end

  end
end
