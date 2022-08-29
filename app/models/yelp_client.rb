class YelpClient

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
      if category["parent_aliases"].include?('restaurants')
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
end