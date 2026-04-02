// client/src/api/messageApi.js
import API from "./axios";

// =======================
// SEND MESSAGE
// =======================
export const sendMessage = async (receiverId, text) => {
  try {
    const res = await API.post("/messages", { receiverId, text });
    return res.data;
  } catch (err) {
    console.error("❌ Send Message Error:", err.response?.data || err.message);
    throw err;
  }
};

// =======================
// GET CHAT BETWEEN 2 USERS
// =======================
export const getMessages = async (receiverId) => {
  try {
    const res = await API.get(`/messages/${receiverId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Get Messages Error:", err.response?.data || err.message);
    throw err;
  }
};