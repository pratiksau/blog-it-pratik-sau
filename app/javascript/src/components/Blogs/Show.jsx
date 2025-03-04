import React, { useEffect, useState } from "react";

import { Avatar, Tag, Typography } from "@bigbinary/neetoui";
import { format } from "date-fns";
import { useHistory, useParams } from "react-router-dom";

import postsApi from "apis/posts";

import PageLoader from "../commons/PageLoader";

const Show = () => {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [categories, setCategories] = useState(null);
  const [user, setUser] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const history = useHistory();

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const {
        data: {
          post: { title, description, categories, user, created_at },
        },
      } = await postsApi.show(slug);
      setTitle(title);
      setDescription(description);
      setCategories(categories);
      setUser(user);
      setCreatedAt(created_at);
    } catch (error) {
      logger.error(error);
      history.push("/blogs");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);

    return format(date, "dd MMMM yyyy");
  };
  formatDate(createdAt);

  useEffect(() => {
    fetchPostDetails();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-y-8">
      <div className="mt-8 flex w-full items-start justify-between gap-x-6">
        <div className="flex flex-col gap-y-6 p-8">
          <div className="flex flex-row gap-x-1">
            {categories.map(category => (
              <Tag
                key={category.id}
                label={category.name}
                style="success"
                type="solid"
              />
            ))}
          </div>
          <Typography className="text-3xl font-semibold">{title}</Typography>
          <div className="flex flex-row gap-x-2">
            <Avatar user={{ name: user.name }} />
            <div className="flex flex-col gap-x-2">
              <Typography className="text-sm text-black">
                {user.name}
              </Typography>
              <Typography className="text-xs text-gray-500">
                {formatDate(createdAt)}
              </Typography>
            </div>
          </div>
          <Typography className="text-base text-gray-700">
            {description}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Show;
