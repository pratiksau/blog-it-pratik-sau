import React, { useState, useEffect, useRef } from "react";

import { Typography, Button, ActionDropdown } from "@bigbinary/neetoui";

import BlogForm from "./Form";

import { setAuthHeaders } from "../../apis/axios";
import categoryApi from "../../apis/categories";
import postApi from "../../apis/posts";
import userApi from "../../apis/users";
import { getFromLocalStorage } from "../../utils/storage";

const CreateBlog = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState("published");
  const formRef = useRef(null);

  useEffect(() => {
    setAuthHeaders();

    const fetchCategories = async () => {
      try {
        const response = await categoryApi.fetch();
        setCategories(response.data.categories);
      } catch (error) {
        logger.error(error);
      }
    };

    const currentUserId = getFromLocalStorage("authUserId");
    setUserId(currentUserId);

    fetchCategories();
  }, []);

  const handleSubmit = async values => {
    const { title, description, selectedCategories } = values;
    setLoading(true);
    try {
      const category_ids = selectedCategories.map(category => category.value);

      const userResponse = await userApi.show(userId);

      const organization_id = userResponse.data.user.organization_id;

      await postApi.create({
        title,
        description,
        category_ids,
        user_id: userId,
        organization_id,
        is_bloggable: true,
        status,
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

  const handleSaveAsDraft = () => {
    setStatus("draft");
    // if (formRef.current) {
    //   formRef.current.handleSubmit();
    // }
  };

  const handlePublish = () => {
    setStatus("published");
    // if (formRef.current) {
    //   formRef.current.handleSubmit();
    // }
  };

  // const handleSubmit = () => {
  //   if (formRef.current) {
  //     formRef.current.handleSubmit();
  //   }
  // };

  const handleSubmitButton = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <Typography className="text-3xl font-bold">New blog post</Typography>
        <div className="flex space-x-2">
          <Button
            className="border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
            data-cy="cancel-button"
            disabled={loading}
            style="tertiary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <ActionDropdown
            buttonStyle="secondary"
            label={status === "published" ? "Publish" : "Save as draft"}
            buttonProps={{
              className: "bg-black text-white",
              disabled: loading,
            }}
            onClick={handleSubmitButton}
          >
            <li>
              <Button
                label="Save as draft"
                style="tertiary"
                onClick={handleSaveAsDraft}
              />
            </li>
            <li>
              <Button
                label="Publish"
                style="tertiary"
                onClick={handlePublish}
              />
            </li>
          </ActionDropdown>
        </div>
      </div>
      <div className="mx-auto max-w-3xl rounded-lg border border-gray-200 p-8 shadow-sm">
        <BlogForm
          categories={categories}
          formRef={formRef}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CreateBlog;
