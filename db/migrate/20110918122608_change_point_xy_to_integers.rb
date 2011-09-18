class ChangePointXyToIntegers < ActiveRecord::Migration
  def self.up
    change_column :points, :x, :integer
    change_column :points, :y, :integer
  end

  def self.down
    change_column :points, :x, :float
    change_column :points, :y, :float
  end
end
