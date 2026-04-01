import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });

  // Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
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

      const data = await loginUser(user);

      console.log("✅ Response:", data);

      if (data.data?.token) {
        alert("Login successful!");
        navigate("/home");
      } else {
        alert("No token received!");
      }

    } catch (err) {
      console.error("❌ LOGIN ERROR:", err?.message);
      alert(err.message || "Login failed!");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-sm mx-auto bg-black text-white min-h-screen justify-center">
      <h2 className="text-2xl font-bold text-center">Login</h2>

      <input
        name="email"
        placeholder="Email"
        value={user.email}
        onChange={handleChange}
        className="border border-gray-600 bg-black text-white p-2 rounded"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={user.password}
        onChange={handleChange}
        className="border border-gray-600 bg-black text-white p-2 rounded"
      />

      <button
        type="button"
        onClick={handleLogin}
        className="bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 transition"
      >
        Login
      </button>

      <p className="text-center text-sm text-gray-400">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-500">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;