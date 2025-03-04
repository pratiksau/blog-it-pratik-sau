import React from "react";

import { Tag, Typography } from "@bigbinary/neetoui";
import { Link } from "react-router-dom";

const Card = ({ title, description, date, slug, author, category }) => (
  <Link to={`/blogs/${slug}`}>
    <div className="border-b border-gray-200 pb-8">
      <Typography className="mb-2 line-clamp-2 text-2xl font-semibold">
        {title}
      </Typography>
      <div className="my-2 flex flex-wrap gap-2">
        {category.map(category => (
          <Tag
            key={category.id}
            label={category.name}
            style="success"
            type="solid"
          />
        ))}
      </div>
      <Typography className="mb-2 line-clamp-2 text-sm text-gray-500">
        {description}
      </Typography>
      <Typography className="text-sm text-black">{author}</Typography>
      <Typography className="text-xs text-gray-500">{date}</Typography>
    </div>
  </Link>
);

export default Card;
