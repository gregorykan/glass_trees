class CreateGroups < ActiveRecord::Migration[5.2]
  def change
    create_table :groups do |t|
      t.string :name

      t.timestamps
    end
    add_column :users, :group_id, :integer
    add_index :users, :group_id
  end
end
