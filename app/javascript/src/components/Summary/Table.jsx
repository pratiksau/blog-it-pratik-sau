import React, { useState } from "react";

import { MenuHorizontal } from "@bigbinary/neeto-icons";
import { Button, Dropdown, Table, Tooltip } from "@bigbinary/neetoui";
import { format } from "date-fns";
import { Link } from "react-router-dom";

import postApi from "../../apis/posts";

const BlogTable = ({ posts, setPosts }) => {
  const [selectedPosts, setSelectedPosts] = useState([]);

  const handlePublishToggle = async (slug, currentStatus) => {
    try {
      await postApi.update(slug, {
        status: currentStatus === "published" ? "draft" : "published",
      });

      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.slug === slug) {
            return {
              ...post,
              status: currentStatus === "published" ? "draft" : "published",
            };
          }

          return post;
        })
      );
    } catch (error) {
      logger.error(error);
    }
  };

  const handleDelete = async slug => {
    try {
      await postApi.destroy(slug);
      window.location.reload(); // Refresh to show updated list
    } catch (error) {
      logger.error(error);
    }
  };

  // Destructure and format post data for the table
  // const formattedPosts = posts.map(post => ({
  //   title: post.title,
  //   slug: post.slug,
  //   categories: post.categories || [],
  //   created_at: post.created_at,
  //   status: post.status,
  //   key: post.id || post.slug, // Ensure each row has a unique key
  // }));

  const formatDate = dateString => {
    const date = new Date(dateString);

    return format(date, "dd MMMM yyyy");
  };

  const columnData = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 250,
      render: (title, record) => (
        <Tooltip content={title}>
          <Link
            className="line-clamp-1 text-indigo-500 hover:text-indigo-700"
            to={`/blogs/${record.slug}/edit`}
          >
            {title}
          </Link>
        </Tooltip>
      ),
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      width: 150,
      render: categories =>
        categories.map(category => category.name).join(", "),
    },
    {
      title: "Published At",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render: date => formatDate(date),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 50,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: 10,
      render: (_, record) => (
        <Dropdown
          buttonStyle="text"
          icon={() => <MenuHorizontal />}
          onClick={() => logger.log(record)}
        >
          <li>
            <Button
              style="text"
              label={
                record.status.toLowerCase() === "published"
                  ? "Unpublish"
                  : "Publish"
              }
              onClick={() =>
                handlePublishToggle(record.slug, record.status.toLowerCase())
              }
            />
          </li>
          <li>
            <Button
              label="Delete post"
              style="danger-text"
              onClick={() => handleDelete(record.slug)}
            />
          </li>
        </Dropdown>
      ),
    },
  ];

  const rowData = posts.map(post => ({
    title: post.title,
    slug: post.slug,
    categories: post.categories,
    created_at: post.created_at,
    status: post.status.charAt(0).toUpperCase() + post.status.slice(1),
    key: post.id,
    id: post.id,
  }));

  return (
    <Table
      rowSelection
      columnData={columnData}
      defaultPageSize={10}
      rowData={rowData}
      selectedRowKeys={selectedPosts}
      onRowSelect={selectedPosts => setSelectedPosts(selectedPosts)}
    />
  );
};

export default BlogTable;
