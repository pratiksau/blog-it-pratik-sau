import React, { useState } from "react";

import { Book, Edit, List } from "@bigbinary/neeto-icons";
import { Button, Avatar } from "@bigbinary/neetoui";
import classnames from "classnames";
import { useLocation } from "react-router-dom";

import Pane from "./Pane";

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [isPaneOpen, setIsPaneOpen] = useState(false);

  const isActive = path => {
    if (path === "/" && (pathname === "/" || pathname === "/blogs")) {
      return true;
    }

    return pathname === path;
  };

  const togglePane = () => {
    setIsPaneOpen(!isPaneOpen);
  };

  return (
    <div className="flex flex-row">
      <div className="flex h-screen w-16 flex-col justify-between border-r border-gray-200 bg-gray-50 py-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex justify-center">
            <Button
              icon={() => <Book />}
              style="text"
              className={classnames({
                "rounded-lg bg-black p-1 text-white": isPaneOpen,
              })}
              onClick={togglePane}
            />
          </div>
          <div className="flex justify-center">
            <Button
              icon={() => <List />}
              style="text"
              to="/"
              className={classnames({
                "rounded-lg bg-black p-1 text-white": isActive("/"),
              })}
            />
          </div>
          <div className="flex justify-center">
            <Button
              icon={() => <Edit />}
              style="text"
              to="/blogs/create"
              className={classnames({
                "rounded-lg bg-black p-1 text-white": isActive("/blogs/create"),
              })}
            />
          </div>
        </div>
        <div className="flex justify-center pb-4">
          <Avatar user={{ name: "Pratik Sau" }} />
        </div>
      </div>
      <div
        className={`h-screen overflow-hidden transition-all duration-300 ease-in-out ${
          isPaneOpen ? "w-[20vw]" : "w-0"
        }`}
      >
        <div
          className={`h-full w-[20vw] bg-gray-300 ${
            isPaneOpen ? "" : "pointer-events-none"
          }`}
        >
          <Pane />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
