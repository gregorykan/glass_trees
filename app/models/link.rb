class Link < ApplicationRecord
  belongs_to :source, foreign_key: :source_id, class_name: "Node"
  belongs_to :target, foreign_key: :target_id, class_name: "Node"
  belongs_to :workspace, optional: true
  # validate :prevent_option_from_belonging_to_more_than_one_question
  before_save :add_workspace_id

  # def prevent_option_from_belonging_to_more_than_one_question
  #   source_node = Node.find(self.source_id)
  #   if source_node.node_type == 'option'
  #     has_existing_links_to_questions = Link.where(source_id: self.source_id).any?
  #     if has_existing_links_to_questions
  #       errors.add(:base, "An option can't belong to more than one question")
  #     end
  #   end
  # end

  def add_workspace_id
    self.workspace_id = Node.find(self.target_id).workspace_id
  end
end
