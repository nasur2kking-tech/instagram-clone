import API from "./axios";

// =======================
// CREATE POST (UPLOAD)
// =======================
export const createPost = (postData) => {
  const formData = new FormData();

  formData.append("image", postData.image); // ✅ must be "image"
  formData.append("caption", postData.caption);

  return API.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// =======================
// GET FEED POSTS
// =======================
export const getPosts = () => API.get("/posts");

// =======================
// LIKE / UNLIKE
// =======================
export const likePost = (id) =>
  API.put(`/posts/${id}/like`);

// =======================
// COMMENT
// =======================
export const commentPost = (id, comment) =>
  API.post(`/posts/${id}/comment`, { text: comment });

// =======================
// GET USER POSTS
// =======================
export const getUserPosts = (userId) =>
  API.get(`/posts/user/${userId}`);