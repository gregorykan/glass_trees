class Link < ApplicationRecord
  belongs_to :source, foreign_key: :source_id, class_name: "Node"
  belongs_to :target, foreign_key: :target_id, class_name: "Node"
end
