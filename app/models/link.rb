class Link < ApplicationRecord
  belongs_to :precedent, foreign_key: :precedent_id, class_name: "Node"
  belongs_to :consequent, foreign_key: :consequent_id, class_name: "Node"
end
