import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";

const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  // ✅ AUTO REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!user.email || !user.password) {
      alert("Please enter email and password");
      return;
    }

    try {
      console.log("📤 Sending login data:", user);

      const { data } = await loginUser(user);

      console.log("✅ Response:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data._id);

        alert("Login successful!");
        navigate("/");
      } else {
        alert("No token received!");
      }

    } catch (err) {
      console.error("❌ LOGIN ERROR:", err?.response?.data || err.message);
      alert("Login failed!");
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 max-w-sm mx-auto bg-black text-white min-h-screen justify-center">

      <h2 className="text-xl font-bold text-center">Login</h2>

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="border border-gray-600 bg-black text-white p-2 rounded"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="border border-gray-600 bg-black text-white p-2 rounded"
      />

      <button
        type="button"
        onClick={() => {
          console.log("🟢 LOGIN CLICKED");
          handleLogin();
        }}
        className="bg-blue-600 text-white p-2 rounded font-semibold"
      >
        Login
      </button>

    </div>
  );
};

export default Login;