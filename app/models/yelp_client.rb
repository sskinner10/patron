class YelpClient
  
  PRICES = {'$' => 1, '$$' => 2, '$$$' => 3, '$$$$' => 4}

  def self.get_categories
    url = URI('https://api.yelp.com/v3/categories?locale=en_US')

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request.add_field "Authorization", "Bearer #{ENV["YELP_SECRET_KEY"]}"

    response = https.request(request)
    categories = JSON response.read_body
    categories['categories']
  end

  def self.select_categories(all_categories)

    restaurant_categories = []

    all_categories.each do |category|
      if category["parent_aliases"].include?('restaurants') || category["parent_aliases"].include?('food')
       restaurant_categories << {alias: category['alias'], title: category['title']}
      end
    end

    restaurant_categories
  end

  def self.create_restaurant_categories(categories)
    categories.each do |category|
      Category.create(
        title: category[:title],
        alias: category[:alias]
      )
    end
  end

  def self.get_new_recommendations(params)
    category = params['category']
    price = params['price'].to_i
    lat = params['lat']
    lon = params['lon']
    radius = (params['radius'].to_f * 1609.344).to_i

    url = URI("https://api.yelp.com/v3/businesses/search?term=#{category}&latitude=#{lat}&longitude=#{lon}&radius=#{radius}&limit=50&open_now=true")

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request.add_field "Authorization", "Bearer #{ENV["YELP_SECRET_KEY"]}"

    response = https.request(request)
    businesses_hash = JSON response.read_body
    
    return businesses_hash['businesses']
  end
end