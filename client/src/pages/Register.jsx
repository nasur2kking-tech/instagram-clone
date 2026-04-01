import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  // ✅ AUTO REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ✅ HANDLE REGISTER
  const handleRegister = async () => {
    if (!user.username || !user.email || !user.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await registerUser(user);

      // ✅ USE RESPONSE (NO ESLINT ERROR)
      console.log("REGISTER RESPONSE:", response.data);

      alert("User registered successfully!");

      // 🔥 REDIRECT TO LOGIN
      navigate("/login");

    } catch (err) {
      console.error("❌ REGISTER ERROR:", err?.response?.data || err.message);
      alert("Registration failed!");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-sm mx-auto bg-black text-white min-h-screen justify-center">

      <h2 className="text-2xl font-bold text-center">Register</h2>

      {/* USERNAME */}
      <input
        name="username"
        placeholder="Username"
        value={user.username}
        onChange={handleChange}
        className="border border-gray-600 bg-black text-white p-2 rounded"
      />

      {/* EMAIL */}
      <input
        name="email"
        placeholder="Email"
        value={user.email}
        onChange={handleChange}
        className="border border-gray-600 bg-black text-white p-2 rounded"
      />

      {/* PASSWORD */}
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={user.password}
        onChange={handleChange}
        className="border border-gray-600 bg-black text-white p-2 rounded"
      />

      {/* REGISTER BUTTON */}
      <button
        onClick={handleRegister}
        className="bg-green-600 text-white p-2 rounded font-semibold hover:bg-green-700 transition"
      >
        Register
      </button>

      {/* 🔥 LOGIN LINK */}
      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500">
          Login
        </Link>
      </p>

    </div>
  );
};

export default Register;