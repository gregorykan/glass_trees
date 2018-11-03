class NodeWithLinksSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :description, :downvotes, :label, :node_type, :resolved, :updated_at, :user_id, :upvotes, :workspace_id, :votes, :source_links, :target_links
end
