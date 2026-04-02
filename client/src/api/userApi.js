import API from "./axios";

// FOLLOW USER
export const followUser = async (targetUserId) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user?._id) {
    throw new Error("User not logged in");
  }

  const res = await API.put(`/users/${targetUserId}/follow`, {
    userId: user._id, // ✅ VERY IMPORTANT
  });

  return res.data;
};