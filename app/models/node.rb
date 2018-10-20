class Node < ApplicationRecord
  has_many :precedent_links, foreign_key: :consequent_id, class_name: "Link"
  has_many :precedents, through: :precedent_links, source: :precedent

  has_many :consequent_links, foreign_key: :precedent_id, class_name: "Link"
  has_many :consequents, through: :consequent_links, source: :consequent
end
