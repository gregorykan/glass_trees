class Link < ApplicationRecord
  belongs_to :source, foreign_key: :source_id, class_name: "Node"
  belongs_to :target, foreign_key: :target_id, class_name: "Node"
  before_create :prevent_option_from_belonging_to_more_than_one_question

  def prevent_option_from_belonging_to_more_than_one_question
    target_node = Node.find(self.target_id)
    if target_node.node_type == 'option'
      has_existing_source_nodes = Node.where(target_id: self.target_id).any?
      if has_existing_source_nodes
        return false
      else
        return true
      end
    else
      return true
    end
  end
end
