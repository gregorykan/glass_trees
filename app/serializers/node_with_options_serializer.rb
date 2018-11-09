class NodeWithOptionsSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :description, :downvotes, :label, :node_type, :resolved, :updated_at, :user_id, :upvotes, :workspace_id, :votes, :options

  has_many :options, serializer: NodeSerializer
end
