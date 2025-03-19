import React from "react";

import { Tag, Typography } from "@bigbinary/neetoui";
import propTypes from "prop-types";
import { Link } from "react-router-dom";

import VoteButtons from "../commons/VoteButtons";

const Card = ({
  title,
  description,
  date,
  slug,
  author,
  category,
  upvotes,
  downvotes,
  userVoted,
  onVoteSuccess,
  isBloggable,
}) => (
  <Link to={`/blogs/${slug}`}>
    <div className="border-b border-gray-200 pb-8">
      <Typography className="mb-2 line-clamp-2 text-2xl font-semibold">
        {title}{" "}
        {isBloggable && <Tag label="Blog-it" style="success" type="solid" />}
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
      <div className="flex items-center justify-between">
        <div>
          <Typography className="text-sm text-black">{author}</Typography>
          <Typography className="text-xs text-gray-500">{date}</Typography>
        </div>
        <div className="flex items-center gap-4">
          <VoteButtons
            downvotes={downvotes}
            slug={slug}
            upvotes={upvotes}
            userVoted={userVoted}
            onVoteSuccess={onVoteSuccess}
          />
        </div>
      </div>
    </div>
  </Link>
);

Card.propTypes = {
  title: propTypes.string.isRequired,
  description: propTypes.string.isRequired,
  date: propTypes.string.isRequired,
  slug: propTypes.string.isRequired,
  author: propTypes.string.isRequired,
  category: propTypes.array.isRequired,
  upvotes: propTypes.number.isRequired,
  downvotes: propTypes.number.isRequired,
  userVoted: propTypes.shape({
    upvoted: propTypes.bool,
    downvoted: propTypes.bool,
  }),
  onVoteSuccess: propTypes.func.isRequired,
};

Card.defaultProps = {
  userVoted: null,
  onVoteSuccess: () => {},
};

export default Card;
