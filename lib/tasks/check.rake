namespace :check do
  desc "Simple task to check if rake is working"
  task working: :environment do
    puts "Rake is working correctly!"
  end
end
