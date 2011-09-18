class Point < ActiveRecord::Base
  validates_presence_of :title
  validates_presence_of :x
  validates_presence_of :y
  validates_presence_of :icon
  
  validates_numericality_of :x, :greater_than_or_equal_to => -3000, :less_than_or_equal_to => 3000, :only_integer => true
  validates_numericality_of :y, :greater_than_or_equal_to => -3000, :less_than_or_equal_to => 3000, :only_integer => true
end
