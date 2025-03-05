import axios from "axios";

const fetch = (searchTerm = "") => {
  const params = searchTerm ? { search: searchTerm } : {};

  return axios.get("/api/v1/categories", { params });
};

const create = payload =>
  axios.post("/api/v1/categories", {
    category: payload,
  });

const categoryApi = {
  fetch,
  create,
};

export default categoryApi;
