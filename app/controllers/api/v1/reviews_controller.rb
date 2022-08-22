class Api::V1::ReviewsController < ApiController
  before_action :authenticate_user

  def create
    review = Review.new(review_params)
    review.user_id = current_user[:id]

    if review.save
      payload = {user: current_user}
      render json: {review: payload}
    else 
      render json: {error: review.errors.full_messages, status: :unprocessable_entity }
    end
  end

  private
  
  def authenticate_user
    if !user_signed_in?
      render json: {error: ["you must be signed in"]}
    end
  end

  def review_params
    params.require(:review).permit(:title, :rating, :heatIndex, :body)
  end
end