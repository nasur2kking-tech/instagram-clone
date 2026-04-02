import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!user.username || !user.email || !user.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const data = await registerUser(user);
      console.log("REGISTER RESPONSE:", data);

      // ✅ FIX: direct token access
      if (data.token) {
        alert("Registration successful! ✅");
        navigate("/home");
      } else {
        alert("No token received after registration!");
      }

    } catch (err) {
      console.error("❌ REGISTER ERROR:", err?.message);
      alert(err.message || "Registration failed!");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-sm mx-auto bg-black text-white min-h-screen justify-center">
      <h2 className="text-2xl font-bold text-center">Register</h2>

      <input
        name="username"
        placeholder="Username"
        value={user.username}
        onChange={handleChange}
        className="border border-gray-600 bg-black text-white p-2 rounded"
      />

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
        onClick={handleRegister}
        className="bg-green-600 text-white p-2 rounded font-semibold hover:bg-green-700 transition"
      >
        Register
      </button>

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