import axios from "axios";

const fetch = (params = {}) => axios.get("/api/v1/posts", { params });

const create = payload =>
  axios.post("/api/v1/posts", {
    post: payload,
  });

const show = slug => axios.get(`/api/v1/posts/${slug}`);

const postApi = {
  fetch,
  create,
  show,
};

export default postApi;
