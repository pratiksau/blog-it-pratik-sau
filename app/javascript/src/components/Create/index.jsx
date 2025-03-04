import React, { useState } from "react";

import { Typography } from "@bigbinary/neetoui";

import BlogForm from "./Form";

import postApi from "../../apis/posts";

const CreateBlog = ({ history }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async values => {
    const { title, description } = values;
    setLoading(true);
    try {
      await postApi.create({ title, description });
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
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CreateBlog;
