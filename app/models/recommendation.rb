class Recommendation
  attr_accessor :name, :address, :id, :image_url, :rating, :url
  
  def initialize (name, street_address, city_address, id, image_url = '', rating = null, url)
    @name = name
    @address = "#{street_address}, #{city_address}"
    @id = id
    @image_url = image_url
    @rating = rating
    @url = url
  end

end