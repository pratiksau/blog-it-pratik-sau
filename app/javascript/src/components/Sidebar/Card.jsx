import React, { memo } from "react";

import { Typography } from "@bigbinary/neetoui";

const Card = memo(({ category, selectedCategoryIds, onCategorySelect }) => {
  const isSelected = selectedCategoryIds.includes(category.id.toString());

  return (
    <div
      className={`my-1 flex cursor-pointer flex-col border ${
        isSelected
          ? "border-white bg-white"
          : "border-black hover:border-gray-500 hover:bg-gray-100"
      }`}
      onClick={() => onCategorySelect(category.id)}
    >
      <div className="p-2">
        <Typography>{category.name}</Typography>
      </div>
    </div>
  );
});

Card.displayName = "Card";
export default Card;
