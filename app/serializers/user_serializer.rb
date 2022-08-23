class UserSerializer < ActiveModel::Serializer
  attributes :id, :patron_handle, :created_at, :reviews, :email, :current_user

  has_many :reviews
end