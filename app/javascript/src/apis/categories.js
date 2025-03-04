import axios from "axios";

const fetch = () => axios.get("/api/v1/categories");

const create = payload =>
  axios.post("/api/v1/categories", {
    category: payload,
  });

const categoryApi = {
  fetch,
  create,
};

export default categoryApi;
