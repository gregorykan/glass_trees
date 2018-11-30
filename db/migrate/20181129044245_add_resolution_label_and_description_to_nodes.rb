class AddResolutionLabelAndDescriptionToNodes < ActiveRecord::Migration[5.2]
  def change
    add_column :nodes, :resolution_label, :string
    add_column :nodes, :resolution_description, :text
  end
end
