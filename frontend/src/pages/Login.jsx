import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Попытка логина как студент
      let res = await axios.post("http://localhost:3000/students/login", { email, password });
      if (!res.data.success) {
        // Если не студент — пробуем как работодатель
        res = await axios.post("http://localhost:3000/employers/login", { email, password });
        if (!res.data.success) {
          alert("Invalid email or password");
          return;
        }
      }
      setUser(res.data.user);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}