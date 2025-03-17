import React, { useState, useEffect, useRef } from "react";

import { ExternalLink, MenuVertical } from "@bigbinary/neeto-icons";
import { Typography, Button, Dropdown } from "@bigbinary/neetoui";
import { useParams, useHistory } from "react-router-dom";

import BlogForm from "./Form";

import { setAuthHeaders } from "../../apis/axios";
import categoryApi from "../../apis/categories";
import postApi from "../../apis/posts";

const EditBlog = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const history = useHistory();
  const [formValues, setFormValues] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    setAuthHeaders();

    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, postResponse] = await Promise.all([
          categoryApi.fetch(),
          postApi.show(slug),
        ]);

        setCategories(categoriesResponse.data.categories);
        setPost(postResponse.data.post);
      } catch (error) {
        logger.error(error);
        history.push("/blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleSubmit = async values => {
    const { title, description, selectedCategories } = values;
    setLoading(true);
    try {
      const category_ids = selectedCategories.map(category => category.value);

      await postApi.update(slug, {
        title,
        description,
        category_ids,
      });

      setLoading(false);
      history.push(`/blogs/${slug}`);
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    history.push(`/blogs/${slug}`);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await postApi.destroy(slug);
      history.push("/blogs");
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = values => {
    setFormValues(values);
  };

  const handlePreview = () => {
    const previewData = formValues
      ? {
          ...post,
          title: formValues.title,
          description: formValues.description,
          categories: formValues.selectedCategories.map(category => ({
            id: category.value,
            name: category.label,
          })),
        }
      : post;

    sessionStorage.setItem("previewPost", JSON.stringify(previewData));
    window.open(`/preview/${slug}`, "_blank");
  };

  const handleSubmitButton = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  if (!post) return null;

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <Typography className="text-3xl font-bold">Edit blog post</Typography>
        <div className="flex space-x-2">
          <Button
            icon={ExternalLink}
            style="text"
            tooltipProps={{
              content: "Preview",
            }}
            onClick={handlePreview}
          />
          <Button
            className="border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
            data-cy="cancel-button"
            disabled={loading}
            style="tertiary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className="bg-black text-white"
            label="Save changes"
            style="tertiary"
            onClick={handleSubmitButton}
          />
          <Dropdown
            icon={() => <MenuVertical />}
            buttonProps={{
              style: "text",
              disabled: loading,
            }}
          >
            <li>
              <Button
                label="Delete post"
                style="danger-text"
                onClick={handleDelete}
              />
            </li>
          </Dropdown>
        </div>
      </div>
      <div className="mx-auto max-w-3xl rounded-lg border border-gray-200 p-8 shadow-sm">
        <BlogForm
          hideButtons
          isEdit
          categories={categories}
          formRef={formRef}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          loading={loading}
          post={post}
          onFormChange={handleFormChange}
        />
      </div>
    </div>
  );
};

export default EditBlog;
