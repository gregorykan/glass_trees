class AddLabelAndDescriptionToNodes < ActiveRecord::Migration[5.2]
  def change
    add_column :nodes, :label, :string
    add_column :nodes, :description, :text
  end
end
