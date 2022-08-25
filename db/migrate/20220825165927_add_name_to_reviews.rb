class AddNameToReviews < ActiveRecord::Migration[5.2]
  def change
    add_column :reviews, :place_name, :string, null: false, default: "Restaurant"
  end
end
