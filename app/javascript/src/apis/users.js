import axios from "axios";

const show = id => axios.get(`/api/v1/users/${id}`);

const userApi = {
  show,
};

export default userApi;
