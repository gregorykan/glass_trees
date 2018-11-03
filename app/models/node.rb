class Node < ApplicationRecord
  has_many :source_links, foreign_key: :target_id, class_name: "Link"
  has_many :target_links, foreign_key: :source_id, class_name: "Link"

  has_many :precedent_questions, -> { where node_type: 'question' }, through: :source_links, source: :source
  has_many :consequent_questions, -> { where node_type: 'question' }, through: :target_links, source: :target

  has_many :options, -> { where node_type: 'option' }, through: :source_links, source: :source

  belongs_to :workspace
  belongs_to :user

  has_many :votes
end
