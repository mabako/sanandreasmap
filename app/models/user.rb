class User < ActiveRecord::Base
  if Rails.env.production?
    devise :database_authenticatable, :confirmable, :recoverable, :rememberable, :trackable, :validatable
  else
    devise :database_authenticatable, :registerable, :confirmable, :recoverable, :rememberable, :trackable, :validatable
  end
end
