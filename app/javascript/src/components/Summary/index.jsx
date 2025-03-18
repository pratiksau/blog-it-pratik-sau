import React, { useEffect, useState } from "react";

import { Filter } from "@bigbinary/neeto-icons";
import {
  Button,
  Pane,
  Typography,
  Input,
  Select,
  Dropdown,
  Checkbox,
  ActionDropdown,
  Alert,
  Tag,
} from "@bigbinary/neetoui";
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
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    categories: true,
    created_at: true,
    status: true,
    actions: true,
  });
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [isClearAllAlertOpen, setIsClearAllAlertOpen] = useState(false);

  const { MenuItem } = Dropdown;

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

  const handleRemoveCategory = categoryValue => {
    const updatedCategories = selectedCategories.filter(
      c => c.value !== categoryValue
    );
    setSelectedCategories(updatedCategories);
    fetchPosts({
      search: searchTerm,
      category_ids: updatedCategories.map(c => c.value).join(","),
      status: selectedStatus?.value,
    });
  };

  const handleRemoveStatus = () => {
    setSelectedStatus(null);
    fetchPosts({
      search: searchTerm,
      category_ids: selectedCategories.map(cat => cat.value).join(","),
    });
  };

  const handleColumnVisibilityChange = columnKey => {
    if (columnKey === "title") return;
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const handleBulkStatusChange = async targetStatus => {
    try {
      const selectedPostIds = posts
        .filter(post => selectedPosts.includes(post.id))
        .map(post => post.id);

      if (selectedPostIds.length === 0) return;

      const postsToUpdate = posts.filter(
        post =>
          selectedPosts.includes(post.id) &&
          post.status.toLowerCase() !== targetStatus
      );

      if (postsToUpdate.length === 0) {
        logger.log("All selected posts are already in the target status");
        setSelectedPosts([]);

        return;
      }

      const postsToUpdateIds = postsToUpdate.map(post => post.id);

      await postApi.bulkUpdate({
        post_ids: postsToUpdateIds,
        status: targetStatus,
      });

      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (postsToUpdateIds.includes(post.id)) {
            return {
              ...post,
              status: targetStatus,
            };
          }

          return post;
        })
      );

      setSelectedPosts([]);
    } catch (error) {
      logger.error("Error changing post status:", error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const selectedPostIds = posts
        .filter(post => selectedPosts.includes(post.id))
        .map(post => post.id);

      if (selectedPostIds.length === 0) return;

      await postApi.bulkDelete(selectedPostIds);

      setPosts(prevPosts =>
        prevPosts.filter(post => !selectedPostIds.includes(post.id))
      );

      setSelectedPosts([]);
    } catch (error) {
      logger.error("Error deleting posts:", error);
    }
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
              {searchTerm || selectedCategories.length > 0 || selectedStatus ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span>{posts.length} results for</span>
                  {searchTerm && (
                    <span className="font-medium">"{searchTerm}"</span>
                  )}
                  {selectedCategories.length > 0 &&
                    selectedCategories.map(category => (
                      <Tag
                        key={category.value}
                        label={category.label}
                        onClose={() => handleRemoveCategory(category.value)}
                      />
                    ))}
                  {selectedStatus && (
                    <Tag
                      label={selectedStatus.label}
                      onClose={handleRemoveStatus}
                    />
                  )}
                </div>
              ) : (
                `${posts.length} articles`
              )}
            </Typography>
          </div>
          <div className="flex flex-row items-center">
            {selectedPosts.length > 0 ? (
              <div className="flex flex-row items-center">
                <ActionDropdown
                  buttonStyle="secondary"
                  className="p-2"
                  label="Change Status"
                >
                  <MenuItem
                    className="px-4 py-2"
                    onClick={() => handleBulkStatusChange("published")}
                  >
                    Publish
                  </MenuItem>
                  <MenuItem
                    className="px-4 py-2"
                    onClick={() => handleBulkStatusChange("draft")}
                  >
                    Draft
                  </MenuItem>
                </ActionDropdown>
                <Button
                  label="Delete"
                  style="danger-text"
                  onClick={() => setIsClearAllAlertOpen(true)}
                />
              </div>
            ) : (
              <ActionDropdown
                buttonStyle="secondary"
                className="p-2"
                label="Columns"
              >
                <MenuItem className="px-4 py-2">
                  <Checkbox checked disabled id="column-title" label="Title" />
                </MenuItem>
                <MenuItem className="px-4 py-2">
                  <Checkbox
                    checked={visibleColumns.categories}
                    id="column-categories"
                    label="Categories"
                    onChange={() => handleColumnVisibilityChange("categories")}
                  />
                </MenuItem>
                <MenuItem className="px-4 py-2">
                  <Checkbox
                    checked={visibleColumns.created_at}
                    id="column-published-at"
                    label="Published At"
                    onChange={() => handleColumnVisibilityChange("created_at")}
                  />
                </MenuItem>
                <MenuItem className="px-4 py-2">
                  <Checkbox
                    checked={visibleColumns.status}
                    id="column-status"
                    label="Status"
                    onChange={() => handleColumnVisibilityChange("status")}
                  />
                </MenuItem>
              </ActionDropdown>
            )}
            <Button
              className="my-2 ml-2"
              icon={Filter}
              style="text"
              onClick={handleShowPane}
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto px-4">
          <BlogTable
            posts={posts}
            setPosts={setPosts}
            visibleColumns={visibleColumns}
            onSelectionChange={setSelectedPosts}
          />
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
      <Alert
        cancelButtonLabel="Cancel"
        isOpen={isClearAllAlertOpen}
        message={`Are you sure you want to delete ${selectedPosts.length} posts?`}
        submitButtonLabel="Delete"
        title="Delete posts?"
        onClose={() => setIsClearAllAlertOpen(false)}
        onSubmit={handleBulkDelete}
      />
    </div>
  );
};

export default Summary;
