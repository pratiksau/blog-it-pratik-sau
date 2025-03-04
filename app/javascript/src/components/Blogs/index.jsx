import React, { useState, useEffect } from "react";

import { Button, Typography } from "@bigbinary/neetoui";
import { format } from "date-fns";

import Card from "./Card";

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
      <div className="mb-8 flex flex-row items-center justify-between">
        <Typography className="text-4xl font-bold">Blog posts</Typography>
        <Button
          className="border border-black bg-black px-4 py-2 text-white"
          to="/blogs/create"
        >
          Add new blog post
        </Button>
      </div>
      <div className="w-full space-y-8 px-2">
        {posts.map(post => (
          <Card
            date={formatDate(post.created_at)}
            description={post.description}
            key={post.id}
            slug={post.slug}
            title={post.title}
          />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
