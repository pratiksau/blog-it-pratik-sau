import { Toastr } from "@bigbinary/neetoui";
import axios from "axios";

import { getFromLocalStorage, setToLocalStorage } from "../utils/storage";

const DEFAULT_ERROR_MESSAGE =
  "An error occurred while processing your request. Please try again later.";

axios.defaults.baseURL = "/";

const setAuthHeaders = () => {
  axios.defaults.headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": document
      .querySelector('[name="csrf-token"]')
      .getAttribute("content"),
  };

  const token = getFromLocalStorage("authToken");
  const email = getFromLocalStorage("authEmail");

  if (token && email) {
    axios.defaults.headers["X-Auth-Email"] = email;
    axios.defaults.headers["X-Auth-Token"] = token;
  }
};

const handleSuccessResponse = response => {
  if (response) {
    response.success = response.status === 200;
    if (response.data.notice) {
      Toastr.success(response.data.notice);
    }
  }

  return response;
};

const handleErrorResponse = axiosErrorObject => {
  if (axiosErrorObject.response.status === 401) {
    setToLocalStorage({
      authToken: null,
      email: null,
      userId: null,
    });
    setTimeout(() => (window.location.href = "/"), 2000);
  }

  Toastr.error(axiosErrorObject.response.data.error || DEFAULT_ERROR_MESSAGE);
  if (axiosErrorObject.response.status === 423) {
    setTimeout(() => (window.location.href = "/"), 2000);
  }

  return Promise.reject(axiosErrorObject);
};

const registerInterceptors = () => {
  axios.interceptors.response.use(handleSuccessResponse, error =>
    handleErrorResponse(error)
  );
};

const resetAuthTokens = () => {
  delete axios.defaults.headers["X-Auth-Email"];
  delete axios.defaults.headers["X-Auth-Token"];
};

export { registerInterceptors, setAuthHeaders, resetAuthTokens };
