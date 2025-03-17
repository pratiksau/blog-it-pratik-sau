import React, { useEffect, useState } from "react";

import { Filter } from "@bigbinary/neeto-icons";
import { Button, Pane, Typography } from "@bigbinary/neetoui";
import postApi from "src/apis/posts";

import BlogTable from "./Table";

import PageLoader from "../commons/PageLoader";

const Summary = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPane, setShowPane] = useState(false);

  const handleShowPane = () => {
    setShowPane(!showPane);
  };

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
    <div>
      <div className="flex flex-1 flex-col overflow-auto p-8">
        <div className="mb-8 flex flex-row justify-between">
          <div className="flex flex-col">
            <Typography className="text-3xl font-bold">
              My blog posts
            </Typography>
            <Typography className="text-sm text-gray-500">
              {posts.length} articles
            </Typography>
          </div>
          <Button
            className="my-2"
            icon={Filter}
            style="text"
            onClick={handleShowPane}
          />
        </div>
        <div className="flex-1 overflow-auto px-4">
          <BlogTable posts={posts} setPosts={setPosts} />
        </div>
      </div>
      <Pane isOpen={showPane} onClose={handleShowPane}>
        <div className="flex flex-col p-4">
          <Typography>Filter</Typography>
        </div>
      </Pane>
    </div>
  );
};

export default Summary;
