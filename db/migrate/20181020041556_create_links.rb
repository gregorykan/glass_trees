class CreateLinks < ActiveRecord::Migration[5.2]
  def change
    create_table :links do |t|
      t.integer :precedent_id
      t.integer :consequent_id

      t.timestamps
    end
  end
end
