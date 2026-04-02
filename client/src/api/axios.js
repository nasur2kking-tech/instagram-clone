import axios from "axios";

/* eslint-disable no-undef */ // add this at the top of the file

const BASE_URL = process.env.REACT_APP_API_URL || "https://instagram-backend-bm1w.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (error) => Promise.reject(error)
);

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