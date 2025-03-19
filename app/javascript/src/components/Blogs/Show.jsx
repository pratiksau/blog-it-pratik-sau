import React, { useEffect, useState } from "react";

import { Edit } from "@bigbinary/neeto-icons";
import { Avatar, Button, Tag, Typography } from "@bigbinary/neetoui";
import { format } from "date-fns";
import { useHistory, useParams } from "react-router-dom";

import postsApi from "apis/posts";

import PageLoader from "../commons/PageLoader";
import VoteButtons from "../commons/VoteButtons";

const Show = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const history = useHistory();

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const response = await postsApi.show(slug);
      setPost(response.data.post);
    } catch (error) {
      logger.error(error);
      history.push("/blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    history.push(`/blogs/${slug}/edit`);
  };

  const formatDate = dateString => {
    const date = new Date(dateString);

    return format(date, "dd MMMM yyyy");
  };

  const handleVoteSuccess = updatedPost => {
    setPost(updatedPost);
  };

  useEffect(() => {
    fetchPostDetails();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="flex w-full flex-col gap-y-8">
      <div className="mt-8 flex w-full items-start gap-x-6">
        <div className="flex w-full flex-col gap-y-6 p-8">
          <div className="flex flex-row gap-x-1">
            {post.categories.map(category => (
              <Tag
                key={category.id}
                label={category.name}
                style="success"
                type="solid"
              />
            ))}
          </div>
          <div className="flex w-full flex-row justify-between">
            <div className="flex flex-row gap-x-2">
              <Typography className="text-3xl font-semibold">
                {post.title}
              </Typography>
              {post.status === "draft" && (
                <Tag
                  className="mx-2 my-2"
                  label={post.status}
                  style="danger"
                  type="outline"
                />
              )}
            </div>
            <div className="flex items-center gap-4">
              <VoteButtons
                downvotes={post.downvotes}
                slug={post.slug}
                upvotes={post.upvotes}
                userVoted={post.user_vote}
                onVoteSuccess={handleVoteSuccess}
              />
              <Button icon={() => <Edit />} style="text" onClick={handleEdit} />
            </div>
          </div>
          <div className="flex flex-row gap-x-2">
            <Avatar user={{ name: post.user.name }} />
            <div className="flex flex-col gap-x-2">
              <Typography className="text-sm text-black">
                {post.user.name}
              </Typography>
              <Typography className="text-xs text-gray-500">
                {formatDate(post.created_at)}
              </Typography>
            </div>
          </div>
          <Typography className="text-base text-gray-700">
            {post.description}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Show;
