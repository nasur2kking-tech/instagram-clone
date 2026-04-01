import { useState } from "react";
import { registerUser } from "../api/authApi";

const Register = () => {
const [user, setUser] = useState({
username: "",
email: "",
password: "",
});

const handleChange = (e) => {
setUser({ ...user, [e.target.name]: e.target.value });
};

const handleRegister = async () => {
try {
await registerUser(user);
alert("User registered successfully!");
} catch (err) {
console.error(err);
}
};

return ( <div className="flex flex-col gap-3 p-4 max-w-sm mx-auto"> <h2 className="text-xl font-bold">Register</h2>


  <input name="username" placeholder="Username" onChange={handleChange} className="border p-2" />
  <input name="email" placeholder="Email" onChange={handleChange} className="border p-2" />
  <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border p-2" />

  <button onClick={handleRegister} className="bg-green-500 text-white p-2">
    Register
  </button>
</div>


);
};

export default Register;
