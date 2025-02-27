import React, { useState, useEffect } from "react";

import { Typography } from "@bigbinary/neetoui";
import { format } from "date-fns";

import postApi from "../../apis/posts";
import PageLoader from "../commons/PageLoader";

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postApi.fetch();
        setPosts(response.data.posts);
      } catch (error) {
        logger.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = dateString => {
    const date = new Date(dateString);

    return format(date, "dd MMMM yyyy");
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
      <Typography className="mb-8 text-4xl font-bold">Blog posts</Typography>
      <div className="w-full space-y-8">
        {posts.map(post => (
          <div className="border-b border-gray-200 pb-8" key={post.id}>
            <Typography className="mb-2 line-clamp-2 text-2xl font-semibold">
              {post.title}
            </Typography>
            <Typography className="mb-2 line-clamp-2 text-sm text-gray-500">
              {post.description}
            </Typography>
            <Typography className="text-sm text-gray-500">
              {formatDate(post.created_at)}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
