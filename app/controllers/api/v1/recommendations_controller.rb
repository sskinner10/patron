class Api::V1::RecommendationsController < ApiController
  def create
    businesses_array = YelpClient.get_new_recommendations(recommendation_params)

    recommendation = filter_recommendations(businesses_array)
    
    if recommendation 
      render json: {recommendation: recommendation}
    else
      render json: {error: "Something went wrong, please try again or expand your search"}
    end
  end

  private

  PRICES = {'$' => 1, '$$' => 2, '$$$' => 3, '$$$$' => 4}

  def recommendation_params
    params.require(:recommendation).permit(:category, :price, :radius, :lat, :lon)
  end

  def filter_recommendations(businesses_array)
    category = params['recommendation']['category']
    price = params['recommendation']['price'].to_i
    
    businesses_array.select! { |business| business['categories'].find { |cat| cat['alias'] == category } }
    businesses_array.select! { |business| PRICES[business['price']] <= price }
    
    return businesses_array.sample
  end
end