import React, { useEffect, useState, useCallback, useMemo } from "react";

import { AddCircle, Search } from "@bigbinary/neeto-icons";
import { Button, Typography } from "@bigbinary/neetoui";
import { useHistory, useLocation } from "react-router-dom";

import Card from "./Card";
import CategoryModal from "./Modal";

import categoryApi from "../../apis/categories";

const Pane = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const history = useHistory();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const selectedCategoryIds = useMemo(
    () =>
      searchParams.get("category_ids")
        ? searchParams.get("category_ids").split(",")
        : [],
    [searchParams.get("category_ids")]
  );

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.fetch();
      setCategories(response.data.categories);
    } catch (error) {
      logger("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const response = await categoryApi.fetch();
        if (isMounted) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        logger("Error fetching categories:", error);
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategorySelect = useCallback(
    categoryId => {
      const params = new URLSearchParams(location.search);
      const categoryIdStr = categoryId.toString();

      // Convert to array, toggle selection, and join back to string
      let categoryIdsArray = selectedCategoryIds.slice();

      if (categoryIdsArray.includes(categoryIdStr)) {
        // Remove if already selected
        categoryIdsArray = categoryIdsArray.filter(id => id !== categoryIdStr);
      } else {
        // Add if not selected
        categoryIdsArray.push(categoryIdStr);
      }

      if (categoryIdsArray.length === 0) {
        params.delete("category_ids");
      } else {
        params.set("category_ids", categoryIdsArray.join(","));
      }

      history.push({
        pathname: "/blogs",
        search: params.toString(),
      });
    },
    [history, location.search, selectedCategoryIds]
  );

  const handleCreateCategory = async categoryData => {
    try {
      await categoryApi.create(categoryData);
      await fetchCategories();

      return true;
    } catch (error) {
      logger("Error creating category:", error);
      throw error;
    }
  };

  return (
    <div className="flex h-screen w-[20vw] flex-col overflow-y-scroll bg-gray-300">
      <div className="flex flex-col p-2">
        <div className="flex flex-row items-center justify-between">
          <Typography>CATEGORIES</Typography>
          <div className="mx-1 flex flex-row">
            <Button icon={() => <Search />} style="text" />
            <Button
              icon={() => <AddCircle />}
              style="text"
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
        <div className="flex flex-col">
          {categories.map(category => (
            <Card
              category={category}
              key={category.id}
              selectedCategoryIds={selectedCategoryIds}
              onCategorySelect={handleCategorySelect}
            />
          ))}
        </div>
      </div>
      <CategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateCategory}
      />
    </div>
  );
};

export default Pane;
