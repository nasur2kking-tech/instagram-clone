import API from "./axios";

// Register
export const registerUser = (userData) =>
API.post("/auth/register", userData);

// Login
export const loginUser = (userData) =>
API.post("/auth/login", userData);
