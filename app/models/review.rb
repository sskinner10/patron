class Review < ApplicationRecord
  validates :title, presence: true
  validates :rating, numericality: { minimum: 0, maximum: 5 }
  validates :body, presence: true
  
  belongs_to :user
end