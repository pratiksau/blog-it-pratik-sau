import React, { useState, useEffect } from "react";

import { Typography } from "@bigbinary/neetoui";

import BlogForm from "./Form";

import categoryApi from "../../apis/categories";
import postApi from "../../apis/posts";

const CreateBlog = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.fetch();
        setCategories(response.data.categories);
      } catch (error) {
        logger.error(error);
      }
    };

    const currentUserId = 1;
    setUserId(currentUserId);

    fetchCategories();
  }, []);

  const handleSubmit = async values => {
    const { title, description, selectedCategories } = values;
    setLoading(true);
    try {
      const category_ids = selectedCategories.map(category => category.value);

      const organization_id = 1;

      await postApi.create({
        title,
        description,
        category_ids,
        user_id: userId,
        organization_id,
        is_bloggable: true,
      });

      setLoading(false);
      history.push("/blogs");
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    history.push("/blogs");
  };

  return (
    <div className="flex-1 overflow-auto p-8">
      <Typography className="mb-8 text-3xl font-bold">New blog post</Typography>
      <div className="mx-auto max-w-3xl rounded-lg border border-gray-200 p-8 shadow-sm">
        <BlogForm
          categories={categories}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CreateBlog;
