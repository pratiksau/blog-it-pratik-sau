import axios from "axios";

const fetch = () => axios.get("/api/v1/posts");

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
