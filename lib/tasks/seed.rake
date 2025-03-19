require 'faker'

namespace :seed do
  desc "Seed organizations"
  task organizations: :environment do
    organizations = [
      { name: "BigBinary" },
      { name: "Acme Corp" },
      { name: "TechStart" },
      { name: "InnovateLabs" }
    ]

    organizations.each do |org_attrs|
      org = Organization.find_or_initialize_by(name: org_attrs[:name])
      if org.new_record?
        org.save!
        puts "Created organization: #{org.name}"
      else
        puts "Organization already exists: #{org.name}"
      end
    end
  end

  desc "Seed users"
  task users: :environment do
    default_password = "password123"

    users = [
      { name: "Admin User", email: "admin@example.com", organization_name: "BigBinary" },
      { name: "John Doe", email: "john@example.com", organization_name: "Acme Corp" },
      { name: "Jane Smith", email: "jane@example.com", organization_name: "TechStart" },
      { name: "Mark Wilson", email: "mark@example.com", organization_name: "InnovateLabs" }
    ]

    users.each do |user_attrs|
      org = Organization.find_by!(name: user_attrs[:organization_name])

      user = User.find_or_initialize_by(email: user_attrs[:email])
      if user.new_record?
        user.name = user_attrs[:name]
        user.organization_id = org.id
        user.password = default_password
        user.password_confirmation = default_password
        user.save!
        puts "Created user: #{user.name} (#{user.email})"
      else
        puts "User already exists: #{user.email}"
      end
    end
  end

  desc "Seed categories"
  task categories: :environment do
    categories = [
      { name: "Technology" },
      { name: "Science" },
      { name: "Business" },
      { name: "Health" },
      { name: "Arts" },
      { name: "Education" },
      { name: "Sports" }
    ]

    categories.each do |category_attrs|
      category = Category.find_or_initialize_by(name: category_attrs[:name])
      if category.new_record?
        category.save!
        puts "Created category: #{category.name}"
      else
        puts "Category already exists: #{category.name}"
      end
    end
  end

  desc "Seed sample posts"
  task posts: :environment do
    users = User.all
    categories = Category.all

    return if users.empty? || categories.empty?

    10.times do |i|
      user = users.sample
      title = "Sample Post #{i+1}: #{Faker::Lorem.sentence(word_count: 3)}"

      post = Post.find_or_initialize_by(title: title)

      if post.new_record?
        post.description = Faker::Lorem.paragraphs(number: 3).join("\n\n")
        post.user = user
        post.organization_id = user.organization_id
        post.is_bloggable = [true, false].sample
        post.status = ["draft", "published"].sample

        # Add 2-3 random categories
        selected_categories = categories.sample(rand(2..3))
        post.categories = selected_categories

        post.save!
        puts "Created post: #{post.title}"
      else
        puts "Post already exists: #{post.title}"
      end
    end
  end

  desc "Add votes to posts"
  task votes: :environment do
    users = User.all
    posts = Post.all

    return if users.empty? || posts.empty?

    posts.each do |post|
      # Give each post 3-8 random votes
      sample_users = users.sample(rand(3..8))

      sample_users.each do |user|
        # Skip if the user is the post author
        next if user.id == post.user_id

        vote_type = ["upvote", "downvote"].sample

        vote = Vote.find_or_initialize_by(user: user, post: post)
        if vote.new_record?
          vote.vote_type = vote_type
          vote.save!
          puts "Added #{vote_type} to post #{post.id} by user #{user.id}"
        else
          puts "Vote already exists for post #{post.id} by user #{user.id}"
        end
      end

      # Update bloggable status based on votes
      post.update_bloggable_status
    end
  end

  desc "Run all seed tasks"
  task all: [:environment, :organizations, :users, :categories, :posts, :votes] do
    puts "All seed data has been created!"
  end
end
