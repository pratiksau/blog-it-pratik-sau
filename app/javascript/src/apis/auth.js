import axios from "axios";

const signup = payload => axios.post("api/v1/users", { user: payload });
const login = payload => axios.post("api/v1/sessions", { login: payload });
const logout = () => axios.delete("/api/v1/sessions");

const authApi = {
  signup,
  login,
  logout,
};

export default authApi;
