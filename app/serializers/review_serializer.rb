class ReviewSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :rating, :place_id, :created_at, :name

  def name
    response = GooglePlacesClient.get_place_name(object.place_id)
    return response
  end
end