import API from "./axios"; // your pre-configured axios instance

// =======================
// CREATE POST (UPLOAD)
// =======================
export const createPost = async (file, caption, authorId) => {
  try {
    const formData = new FormData();

    // MUST match backend: upload.single("image")
    formData.append("image", file);
    formData.append("caption", caption);
    formData.append("authorId", authorId); // optional (backend may ignore if using token)

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
// GET FEED POSTS
// =======================
export const getPosts = async () => {
  try {
    const res = await API.get("/posts");
    return res.data;
  } catch (err) {
    console.error("❌ Get Posts Error:", err.response?.data || err.message);
    throw err;
  }
};

// =======================
// LIKE / UNLIKE
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
// COMMENT
// =======================
export const commentPost = async (id, comment) => {
  try {
    const res = await API.post(`/posts/${id}/comment`, {
      text: comment,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Comment Error:", err.response?.data || err.message);
    throw err;
  }
};

// =======================
// GET USER POSTS
// =======================
export const getUserPosts = async (userId) => {
  try {
    const res = await API.get(`/posts/user/${userId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Get User Posts Error:", err.response?.data || err.message);
    throw err;
  }
};