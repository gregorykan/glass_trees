class CreateWorkspaces < ActiveRecord::Migration[5.2]
  def change
    create_table :workspaces do |t|
      t.string :name
      t.integer :group_id
      t.integer :root_node_id

      t.timestamps
    end
    add_index :workspaces, :group_id
    add_column :links, :workspace_id, :integer
    add_index :links, :workspace_id
    add_column :nodes, :workspace_id, :integer
    add_index :nodes, :workspace_id
  end
end
