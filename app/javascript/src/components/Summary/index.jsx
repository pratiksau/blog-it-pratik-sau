import React, { useEffect, useState } from "react";

import { Typography } from "@bigbinary/neetoui";
import postApi from "src/apis/posts";

import BlogTable from "./Table";

import PageLoader from "../commons/PageLoader";

const Summary = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const {
        data: { posts },
      } = await postApi.userPosts();
      setPosts(posts);
      logger.log("posts", posts);
    } catch (error) {
      logger.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="mb-8">
        <Typography className="text-3xl font-bold">My blog posts</Typography>
        <Typography className="text-sm text-gray-500">
          {posts.length} articles
        </Typography>
      </div>
      <div className="px-4">
        <BlogTable posts={posts} setPosts={setPosts} />
      </div>
    </div>
  );
};

export default Summary;
