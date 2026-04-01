import API from "./axios";

// Get all posts
export const getPosts = () => API.get("/posts");

// Like a post
export const likePost = (id) => API.put(`/posts/${id}/like`);

// Comment on post
export const commentPost = (id, comment) =>
API.post(`/posts/${id}/comment`, { text: comment });

export const getUserPosts = (userId) =>
API.get(`/posts/user/${userId}`);
