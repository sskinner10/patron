class ReviewSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :rating, :place_id, :created_at, :name, :user_handle, :user_id

  def name
    response = GooglePlacesClient.get_place_name(object.place_id)
    return response
  end

  def user_handle
    object.user.patron_handle
  end
end