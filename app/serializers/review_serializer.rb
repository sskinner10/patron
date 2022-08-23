class ReviewSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :rating, :place_id, :created_at
end