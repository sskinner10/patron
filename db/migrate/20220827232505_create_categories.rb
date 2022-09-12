class CreateCategories < ActiveRecord::Migration[5.2]
  def change
    create_table :categories do |t|
      t.string :alias, null: false
      t.string :title, null: false

      t.timestamps null: false
    end
  end
end
