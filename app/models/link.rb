class Link < ApplicationRecord
  belongs_to :source, foreign_key: :source_id, class_name: "Node"
  belongs_to :target, foreign_key: :target_id, class_name: "Node"
  validate :prevent_option_from_belonging_to_more_than_one_question

  def prevent_option_from_belonging_to_more_than_one_question
    source_node = Node.find(self.source_id)
    if source_node.node_type == 'option'
      has_existing_source_nodes = Link.where(source_id: self.source_id).any?
      if has_existing_source_nodes
        errors.add(:base, "An option can't belong to more than one question")
      end
    end
  end
end
