// client/api/authApi.js

const BASE_URL = "https://instagram-backend-bm1w.onrender.com/api/auth";

// =======================
// REGISTER USER
// =======================
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

  // ✅ FIX: Save FULL USER DATA
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
  }

  return data;
};

// =======================
// LOGIN USER
// =======================
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

  // ✅ FIX: Save FULL USER DATA
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
  }

  return data;
};