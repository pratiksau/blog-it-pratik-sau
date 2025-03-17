import React, { useEffect, useState, useCallback, useMemo } from "react";

import { AddCircle, Close, Search } from "@bigbinary/neeto-icons";
import { Button, Input, Typography } from "@bigbinary/neetoui";
import { useHistory, useLocation } from "react-router-dom";

import Card from "./Card";
import CategoryModal from "./Modal";

import { useDebounce } from "../../../hooks/useDebounce";
import categoryApi from "../../apis/categories";

const SidebarPane = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

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

  const fetchCategories = async (search = "") => {
    try {
      const response = await categoryApi.fetch(search);
      setCategories(response.data.categories);
    } catch (error) {
      logger.log("Error fetching categories:", error);
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
        logger.log("Error fetching categories:", error);
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    fetchCategories(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const handleCategorySelect = useCallback(
    categoryId => {
      const params = new URLSearchParams(location.search);
      const categoryIdStr = categoryId.toString();

      let categoryIdsArray = selectedCategoryIds.slice();

      if (categoryIdsArray.includes(categoryIdStr)) {
        categoryIdsArray = categoryIdsArray.filter(id => id !== categoryIdStr);
      } else {
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
      logger.log("Error creating category:", error);
      throw error;
    }
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchTerm("");
      fetchCategories();
    }
  };

  return (
    <div className="flex h-screen w-[20vw] flex-col overflow-y-scroll bg-gray-300">
      <div className="flex flex-col p-2">
        <div className="flex flex-row items-center justify-between">
          <Typography>CATEGORIES</Typography>
          <div className="mx-1 flex flex-row">
            <Button
              icon={() => <Search />}
              style="text"
              onClick={handleSearchToggle}
            />
            <Button
              icon={() => <AddCircle />}
              style="text"
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
        {showSearch && (
          <div className="my-2">
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              suffix={
                searchTerm ? (
                  <Button
                    icon={() => <Close />}
                    style="text"
                    onClick={() => setSearchTerm("")}
                  />
                ) : null
              }
              onChange={event => setSearchTerm(event.target.value)}
            />
          </div>
        )}
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

export default SidebarPane;
