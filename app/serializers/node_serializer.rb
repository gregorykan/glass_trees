class NodeSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :description, :downvotes, :label, :node_type, :resolved, :updated_at, :user_id, :upvotes, :workspace_id, :votes

  # def upvotes
  #   object.upvotes
  # end
  #
  # def downvotes
  #   object.downvotes
  # end
end
