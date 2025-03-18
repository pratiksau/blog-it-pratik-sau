import axios from "axios";

const fetch = (params = {}) => axios.get("/api/v1/posts", { params });

const create = payload =>
  axios.post("/api/v1/posts", {
    post: payload,
  });

const show = slug => axios.get(`/api/v1/posts/${slug}`);

const update = (slug, payload) =>
  axios.put(`/api/v1/posts/${slug}`, {
    post: payload,
  });

const destroy = slug => axios.delete(`/api/v1/posts/${slug}`);

const userPosts = (filters = {}) =>
  axios.get("/api/v1/posts/user_posts", { params: filters });

const bulkUpdate = payload => axios.patch("/api/v1/posts/bulk_update", payload);

const bulkDelete = postIds =>
  axios.delete("/api/v1/posts/bulk_destroy", {
    data: { post_ids: postIds },
  });

const postApi = {
  fetch,
  create,
  show,
  update,
  destroy,
  userPosts,
  bulkUpdate,
  bulkDelete,
};

export default postApi;
