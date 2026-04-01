// client/api/authApi.js

const BASE_URL = "https://instagram-backend-bm1w.onrender.com/api/auth";

// Register user
export const registerUser = async ({ username, email, password }) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  // Save token if returned
  if (data.data?.token) {
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("userId", data.data._id);
  }

  return data;
};

// Login user
export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  // Save token if returned
  if (data.data?.token) {
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("userId", data.data._id);
  }

  return data;
};