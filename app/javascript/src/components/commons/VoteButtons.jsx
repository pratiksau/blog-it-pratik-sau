import React from "react";

import { UpArrow, DownArrow } from "@bigbinary/neeto-icons";
import { Button, Typography } from "@bigbinary/neetoui";
import propTypes from "prop-types";

import postApi from "../../apis/posts";

const VoteButtons = ({
  slug,
  upvotes,
  downvotes,
  userVoted,
  onVoteSuccess,
}) => {
  const handleUpvote = async e => {
    e.preventDefault();
    try {
      const response = await postApi.upvote(slug);
      onVoteSuccess(response.data.post);
    } catch (error) {
      logger.error("Error upvoting:", error);
    }
  };

  const handleDownvote = async e => {
    e.preventDefault();
    try {
      const response = await postApi.downvote(slug);
      onVoteSuccess(response.data.post);
    } catch (error) {
      logger.error("Error downvoting:", error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center">
        <Button
          className={userVoted?.upvoted ? "text-green-400" : "text-gray-500"}
          icon={UpArrow}
          iconPosition="left"
          style="text"
          onClick={handleUpvote}
        />
        <Typography className="ml-2">{upvotes}</Typography>
      </div>
      <div className="flex items-center">
        <Button
          className={userVoted?.downvoted ? "text-red-500" : "text-gray-500"}
          icon={DownArrow}
          iconPosition="left"
          style="text"
          onClick={handleDownvote}
        />
        <Typography className="ml-2">{downvotes}</Typography>
      </div>
    </div>
  );
};

VoteButtons.propTypes = {
  slug: propTypes.string.isRequired,
  upvotes: propTypes.number.isRequired,
  downvotes: propTypes.number.isRequired,
  userVoted: propTypes.shape({
    upvoted: propTypes.bool,
    downvoted: propTypes.bool,
  }),
  onVoteSuccess: propTypes.func.isRequired,
};

export default VoteButtons;
