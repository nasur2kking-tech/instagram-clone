// client/api/axios.js

import axios from "axios";

const API = axios.create({
  baseURL: "https://instagram-backend-bm1w.onrender.com/api", // ✅ FIXED
});

// =======================
// ADD TOKEN TO EVERY REQUEST
// =======================
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

export default API;