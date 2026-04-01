import API from "./axios";

export const followUser = (targetUserId) =>
  API.put(`/users/${targetUserId}/follow`);