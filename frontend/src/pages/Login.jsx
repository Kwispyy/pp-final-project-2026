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
      let res = await axios.post("http://localhost:3000/students/login", { email, password });
      if (!res.data.success) {
        res = await axios.post("http://localhost:3000/employers/login", { email, password });
        if (!res.data.success) {
          alert("Неверный email или пароль");
          return;
        }
      }
      setUser(res.data.user);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Ошибка входа");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Вход</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email:</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Пароль:</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" className="btn btn-primary w-100">Войти</button>
      </form>
    </div>
  );
}