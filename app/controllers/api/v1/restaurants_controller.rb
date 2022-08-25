class Api::V1::RestaurantsController < ApiController
  def show
    response = GooglePlacesClient.get_place_details(params[:id])
    render json: {
      reviews: ActiveModelSerializers::SerializableResource.new(Review.where(place_id: params[:id]), each_serializer: ReviewSerializer),
      details: response,
      current_user: current_user
    } 
  end
end