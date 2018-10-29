class CreateVotes < ActiveRecord::Migration[5.2]
  def change
    create_table :votes do |t|
      t.integer :user_id
      t.integer :node_id
      t.boolean :is_upvote

      t.timestamps
    end
    add_index :votes, :user_id
    add_index :votes, :node_id
  end
end
