import axios from "axios";

const fetch = () => axios.get("/posts");

const postApi = {
  fetch,
};

export default postApi;
