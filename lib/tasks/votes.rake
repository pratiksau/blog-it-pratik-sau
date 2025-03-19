namespace :votes do
  desc "Reset all vote counters for posts"
  task reset_counters: :environment do
    puts "Resetting vote counters..."

    Post.find_each do |post|
      # Reset the Rails counter cache
      Post.reset_counters(post.id, :votes)

      # Reset the manual upvotes/downvotes counters
      upvotes_count = post.votes.upvote.count
      downvotes_count = post.votes.downvote.count

      post.update_columns(
        upvotes: upvotes_count,
        downvotes: downvotes_count
      )

      print "."
    end

    puts "\nDone!"
  end
end
