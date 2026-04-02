import axios from "axios";

const API = axios.create({
  baseURL: "https://instagram-backend-bm1w.onrender.com/api",
});

// ✅ attach token
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error) // ✅ optional safety
);

export default API;