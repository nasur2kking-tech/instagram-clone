import API from "./axios";

export const sendMessage = (receiverId, text) =>
  API.post("/messages", {
    receiverId,
    text,
  });

export const getMessages = (receiverId) =>
  API.get(`/messages/${receiverId}`);