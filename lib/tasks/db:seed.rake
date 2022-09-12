namespace :db do
  namespace :seed do
    desc "Seed Yelp categories in database for reference in restaurant recommendation"
    task create_categories: :environment do

      all_categories = YelpClient.get_categories
      restaurant_categories = YelpClient.select_categories(all_categories)
      YelpClient.create_restaurant_categories(restaurant_categories)
    end
  end
end
