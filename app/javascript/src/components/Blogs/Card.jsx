import React from "react";

import { Typography } from "@bigbinary/neetoui";
import { Link } from "react-router-dom";

const Card = ({ title, description, date, slug }) => (
  <Link to={`/blogs/${slug}`}>
    <div className="border-b border-gray-200 pb-8">
      <Typography className="mb-2 line-clamp-2 text-2xl font-semibold">
        {title}
      </Typography>
      <Typography className="mb-2 line-clamp-2 text-sm text-gray-500">
        {description}
      </Typography>
      <Typography className="text-sm text-gray-500">{date}</Typography>
    </div>
  </Link>
);

export default Card;
