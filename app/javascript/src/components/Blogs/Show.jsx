import React, { useEffect, useState } from "react";

import { useHistory, useParams } from "react-router-dom";

import postsApi from "apis/posts";

import PageLoader from "../commons/PageLoader";

const Show = () => {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const history = useHistory();

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const {
        data: {
          post: { title, description },
        },
      } = await postsApi.show(slug);
      setTitle(title);
      setDescription(description);
    } catch (error) {
      logger.error(error);
      history.push("/blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-y-8">
      <div className="mt-8 flex w-full items-start justify-between gap-x-6">
        <div className="flex flex-col gap-y-12 p-8">
          <h2 className="text-3xl font-semibold">{title}</h2>
          <p className="text-base text-gray-700">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Show;
