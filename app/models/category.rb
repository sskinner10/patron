class Category < ApplicationRecord
  validates :title, presence: true
  validates :alias, presence: true
end
