class ReviewSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :rating, :place_id, :created_at, :place_name, :user_handle, :user_id

  def user_handle
    object.user.patron_handle
  end
end