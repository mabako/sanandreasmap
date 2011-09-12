class FixDescriptionSpellingForPoints < ActiveRecord::Migration
  def self.up
    rename_column :points, :descripion, :description
  end

  def self.down
    rename_column :points, :description, :descripion
  end
end
