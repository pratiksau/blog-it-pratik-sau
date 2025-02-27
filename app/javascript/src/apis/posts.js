import axios from "axios";

const fetch = () => axios.get("/api/v1/posts");

const postApi = {
  fetch,
};

export default postApi;
