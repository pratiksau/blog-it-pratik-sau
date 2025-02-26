import React from "react";

import { Book, List } from "@bigbinary/neeto-icons";
import { Button, Avatar } from "@bigbinary/neetoui";
import classnames from "classnames";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = path => {
    if (path === "/" && (pathname === "/" || pathname === "/blogs")) {
      return true;
    }

    return pathname === path;
  };

  return (
    <div className="flex h-screen w-16 flex-col justify-between border-r border-gray-200 bg-gray-50 py-4">
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-center">
          <Link to="/">
            <Button
              icon={() => <Book />}
              style="text"
              className={classnames({
                "rounded-lg bg-black p-1 text-white": isActive("/"),
              })}
            />
          </Link>
        </div>
        <div className="flex justify-center">
          <Link to="/lists">
            <Button
              icon={() => <List />}
              style="text"
              className={classnames({
                "rounded-lg bg-black p-1 text-white": isActive("/lists"),
              })}
            />
          </Link>
        </div>
      </div>
      <div className="flex justify-center pb-4">
        <Avatar user={{ name: "Pratik Sau" }} />
      </div>
    </div>
  );
};

export default Sidebar;
