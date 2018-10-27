class WelcomeController < ApiController
  def hello
    render json: { 'hi': 'there' }
  end
end
