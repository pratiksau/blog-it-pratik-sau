import React from "react";

import { Avatar, Tag, Typography } from "@bigbinary/neetoui";
import { format } from "date-fns";

const Preview = ({ post }) => {
  const { title, description, categories, user, created_at, status } = post;

  const formatDate = dateString => {
    const date = new Date(dateString);

    return format(date, "dd MMMM yyyy");
  };

  return (
    <div className="flex w-full flex-col gap-y-8">
      <div className="mt-8 flex w-full items-start gap-x-6">
        <div className="flex w-full flex-col gap-y-6 p-8">
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
          <div className="flex w-full flex-row justify-between">
            <div className="flex flex-row gap-x-2">
              <Typography className="text-3xl font-semibold">
                {title}
              </Typography>
              {status === "draft" && (
                <Tag
                  className="mx-2 my-2"
                  label={status}
                  style="danger"
                  type="outline"
                />
              )}
            </div>
          </div>
          <div className="flex flex-row gap-x-2">
            <Avatar user={{ name: user.name }} />
            <div className="flex flex-col gap-x-2">
              <Typography className="text-sm text-black">
                {user.name}
              </Typography>
              <Typography className="text-xs text-gray-500">
                {formatDate(created_at)}
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

export default Preview;
