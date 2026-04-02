// client/src/api/axios.js
import axios from "axios";

// =======================
// BASE URL (Vite-compatible)
// =======================
const BASE_URL = import.meta.env.VITE_API_URL || "https://instagram-backend-bm1w.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // include cookies if needed
});

// =======================
// REQUEST INTERCEPTOR
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

// =======================
// RESPONSE INTERCEPTOR
// =======================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - logging out");
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default API;