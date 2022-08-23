class AddColumnPlaceIdToReviews < ActiveRecord::Migration[5.2]
  def change
    add_column :reviews, :place_id, :string, null: false, default: ""
  end
end
