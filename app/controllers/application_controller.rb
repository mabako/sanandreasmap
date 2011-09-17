class ApplicationController < ActionController::Base
  protect_from_forgery
  
  before_filter :use_ssl if Rails.env.production?
 
private
  def use_ssl
    if request.ssl?
      response.headers['Strict-Transport-Security'] = 'max-age=1234567890'
    else
      redirect_to "https://" + request.host + request.request_uri, :status => 301
    end
  end
end
