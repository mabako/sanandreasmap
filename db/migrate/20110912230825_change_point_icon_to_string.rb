class ChangePointIconToString < ActiveRecord::Migration
  def self.up
    change_column :points, :icon, :string
  end

  def self.down
    change_column :points, :icon, :integer
  end
end
