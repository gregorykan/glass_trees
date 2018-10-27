class Workspace < ApplicationRecord
  belongs_to :group, optional: true
  has_many :links
  has_many :nodes
end
