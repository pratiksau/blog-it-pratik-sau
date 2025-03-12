import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Preview from ".";

import PageLoader from "../commons/PageLoader";

const PreviewPage = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    try {
      const previewPost = JSON.parse(sessionStorage.getItem("previewPost"));
      if (previewPost) {
        setPost(previewPost);
      }
    } catch (error) {
      logger.error("Error loading preview data:", error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  if (loading) return <PageLoader />;

  if (!post) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Preview data not available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-4 mt-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Preview Mode</h1>
      </div>
      <Preview post={post} />
    </div>
  );
};

export default PreviewPage;
