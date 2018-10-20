class CreateLinks < ActiveRecord::Migration[5.2]
  def change
    create_table :links do |t|
      t.integer :source_id
      t.integer :target_id

      t.timestamps
    end
  end
end
