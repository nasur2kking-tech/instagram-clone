// client/src/api/postApi.js
import API from "./axios"; // pre-configured axios instance

// =======================
// CREATE POST (UPLOAD)
// =======================
export const createPost = async (file, caption) => {
  try {
    if (!file) throw new Error("No file provided for upload");

    const formData = new FormData();
    formData.append("image", file); // MUST match backend upload.single("image")
    formData.append("caption", caption);

    const response = await API.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    console.error("❌ Create Post Error:", err.response?.data || err.message);
    throw err;
  }
};

// =======================
// GET FEED POSTS (HOME)
// =======================
export const getPosts = async (page = 1, limit = 10) => {
  try {
    const res = await API.get(`/posts?page=${page}&limit=${limit}`);
    return res.data;
  } catch (err) {
    console.error("❌ Get Posts Error:", err.response?.data || err.message);
    throw err;
  }
};

// =======================
// LIKE / UNLIKE POST
// =======================
export const likePost = async (id) => {
  try {
    const res = await API.put(`/posts/${id}/like`);
    return res.data;
  } catch (err) {
    console.error("❌ Like Post Error:", err.response?.data || err.message);
    throw err;
  }
};

// =======================
// ADD COMMENT
// =======================
export const commentPost = async (id, comment) => {
  try {
    const res = await API.post(`/posts/${id}/comment`, { text: comment });
    return res.data;
  } catch (err) {
    console.error("❌ Comment Error:", err.response?.data || err.message);
    throw err;
  }
};

// =======================
// GET USER POSTS (PROFILE)
// =======================
export const getUserPosts = async (userId, page = 1, limit = 10) => {
  try {
    const res = await API.get(
      `/posts/user/${userId}?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Get User Posts Error:", err.response?.data || err.message);
    throw err;
  }
};