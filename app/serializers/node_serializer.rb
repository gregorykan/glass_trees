class NodeSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :description, :label, :node_type, :resolved, :updated_at, :user_id, :workspace_id, :votes
end
