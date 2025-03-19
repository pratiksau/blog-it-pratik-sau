import React, { useState, useEffect } from "react";

import { Button, Typography } from "@bigbinary/neetoui";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";

import Card from "./Card";

import postApi from "../../apis/posts";
import PageLoader from "../commons/PageLoader";

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get("category_id");

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const categoryIds = searchParams.get("category_ids");
        const params = categoryIds ? { category_ids: categoryIds } : {};
        const response = await postApi.fetch(params);

        if (isMounted) {
          setPosts(response.data.posts);
          setLoading(false);
        }
      } catch (error) {
        logger.error("Error fetching posts:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [searchParams.get("category_ids")]);

  const formatDate = dateString => {
    const date = new Date(dateString);

    return format(date, "dd MMMM yyyy");
  };

  const handleVoteSuccess = updatedPost => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.slug === updatedPost.slug ? updatedPost : post
      )
    );
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="mb-8 flex flex-row items-center justify-between">
        <div>
          <Typography className="text-4xl font-bold">Blog posts</Typography>
          {categoryId && (
            <Typography className="text-sm text-gray-500">
              Filtered by category
            </Typography>
          )}
        </div>
        <Button
          className="border border-black bg-black px-4 py-2 text-white"
          to="/blogs/create"
        >
          Add new blog post
        </Button>
      </div>
      {posts.length > 0 ? (
        <div className="w-full space-y-8 px-2">
          {posts.map(post => (
            <Card
              author={post.user.name}
              category={post.categories}
              date={formatDate(post.created_at)}
              description={post.description}
              downvotes={post.downvotes}
              isBloggable={post.is_bloggable}
              key={post.id}
              slug={post.slug}
              title={post.title}
              upvotes={post.upvotes}
              userVoted={post.user_vote}
              onVoteSuccess={handleVoteSuccess}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <Typography className="text-gray-500">
            No posts found for the selected category.
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Blogs;
