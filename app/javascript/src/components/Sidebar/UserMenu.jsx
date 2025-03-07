import React, { useState, useRef, useEffect } from "react";

import { Avatar } from "@bigbinary/neetoui";
import PropTypes from "prop-types";

import authApi from "../../apis/auth";
import { resetAuthTokens } from "../../apis/axios";
import { setToLocalStorage } from "../../utils/storage";

const UserMenu = ({
  userName = "John Doe",
  userEmail = "john.doe@example.com",
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setToLocalStorage({
        authToken: null,
        email: null,
        userId: null,
      });
      resetAuthTokens();
      window.location.href = "/login";
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <div className="cursor-pointer" onClick={toggleMenu}>
        <Avatar user={{ name: userName }} />
      </div>
      {isMenuOpen && (
        <div className="absolute bottom-full left-full ml-2 w-48 rounded-md border border-gray-200 bg-white py-2 shadow-lg">
          <div className="px-4 py-2">
            <div className="flex items-center">
              <div className="mr-3">
                <Avatar size="small" user={{ name: userName }} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
            </div>
          </div>
          <hr className="my-1" />
          <button
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <span className="flex items-center">
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Logout
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

UserMenu.propTypes = {
  userName: PropTypes.string.isRequired,
};

export default UserMenu;
