class CreatePoints < ActiveRecord::Migration
  def self.up
    create_table :points do |t|
      t.string :title
      t.string :descripion
      t.string :link
      t.float :x
      t.float :y
      t.integer :icon

      t.timestamps
    end
  end

  def self.down
    drop_table :points
  end
end
