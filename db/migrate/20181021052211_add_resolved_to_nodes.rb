class AddResolvedToNodes < ActiveRecord::Migration[5.2]
  def change
    add_column :nodes, :resolved, :boolean
  end
end
