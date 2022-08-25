class GooglePlacesClient
   
  def self.get_place_name(place_id)
    url = URI("https://maps.googleapis.com/maps/api/place/details/json?place_id=#{place_id}&fields=name&key=#{ENV["SECRET_GOOGLE_KEY"]}")

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Get.new(url)

    response = https.request(request)
    response_hash = JSON response.read_body

    name = response_hash['result']['name']
    return name
  end

  def self.get_place_details(place_id)
    url = URI("https://maps.googleapis.com/maps/api/place/details/json?place_id=#{place_id}&fields=name%2Crating%2Cformatted_address%2Cwebsite%2Cphoto%2Cuser_ratings_total&key=#{ENV["SECRET_GOOGLE_KEY"]}")

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Get.new(url)

    response = https.request(request)
    response_hash = JSON response.read_body
    format_place_details(response_hash['result'])
  end

  def self.format_place_details(response)
    photos = response['photos'].map do |photo|
      photo['photo_reference']
    end
    return response = {**response, photos: photos}
  end
end
