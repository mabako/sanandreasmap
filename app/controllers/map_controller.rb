class MapController < ApplicationController
  def index
     if request.ssl?
       @api_key = 'ABQIAAAAMWRZBB5vEAlPU51oiMzCwRQtfFQHhrL-D7NtvvPYCl3EcDEs1hQG6QNBVp3YL8FKRdaQoz6wolTnuw'
     else
       @api_key = 'ABQIAAAAMWRZBB5vEAlPU51oiMzCwRSwqdAaTweww-pAVZHjK8FxllAlEhRhqDskVzwJrPLrmiXKGDdVAHXm6A'
     end
     render :layout => false
  end
end
