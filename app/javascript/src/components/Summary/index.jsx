import React, { useEffect, useState } from "react";

import { Filter } from "@bigbinary/neeto-icons";
import { Button, Pane, Typography, Input, Select } from "@bigbinary/neetoui";
import categoryApi from "src/apis/categories";
import postApi from "src/apis/posts";

import BlogTable from "./Table";

import PageLoader from "../commons/PageLoader";

const Summary = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPane, setShowPane] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [categories, setCategories] = useState([]);

  const handleShowPane = () => {
    setShowPane(!showPane);
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.fetch();
      setCategories(response.data.categories);
    } catch (error) {
      logger.error("Error fetching categories:", error);
    }
  };

  const fetchPosts = async (filters = {}) => {
    try {
      setLoading(true);
      const {
        data: { posts },
      } = await postApi.userPosts(filters);
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
    fetchCategories();
  }, []);

  const handleApplyFilters = () => {
    const filters = {};

    if (searchTerm) {
      filters.search = searchTerm;
    }

    if (selectedCategories.length > 0) {
      filters.category_ids = selectedCategories.map(cat => cat.value).join(",");
    }

    if (selectedStatus) {
      filters.status = selectedStatus.value;
    }

    fetchPosts(filters);
    handleShowPane();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedStatus(null);
    fetchPosts();
    handleShowPane();
  };

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
        <Pane.Header>
          <Typography style="h2">Filter</Typography>
        </Pane.Header>
        <Pane.Body>
          <div className="flex w-full flex-col space-y-4">
            <div>
              <Typography className="mb-2" style="body2">
                Search
              </Typography>
              <Input
                className="w-full"
                placeholder="Search by title"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Typography className="mb-2" style="body2">
                Categories
              </Typography>
              <Select
                isMulti
                className="w-full"
                placeholder="Select categories"
                value={selectedCategories}
                options={categories.map(category => ({
                  value: category.id,
                  label: category.name,
                }))}
                onChange={selected => setSelectedCategories(selected || [])}
              />
            </div>
            <div>
              <Typography className="mb-2" style="body2">
                Status
              </Typography>
              <Select
                className="w-full"
                placeholder="Select status"
                value={selectedStatus}
                options={[
                  { value: "published", label: "Published" },
                  { value: "draft", label: "Draft" },
                ]}
                onChange={selected => setSelectedStatus(selected)}
              />
            </div>
          </div>
        </Pane.Body>
        <Pane.Footer>
          <div className="flex justify-end space-x-2">
            <Button
              className="rounded-none bg-black text-white"
              label="Apply Filters"
              style="primary"
              onClick={handleApplyFilters}
            />
            <Button
              label="Clear Filters"
              style="text"
              onClick={handleClearFilters}
            />
          </div>
        </Pane.Footer>
      </Pane>
    </div>
  );
};

export default Summary;
