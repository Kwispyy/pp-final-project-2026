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
      const res = await axios.post("http://localhost:3000/students/login", { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        navigate("/profile");
      } else {
        alert("Неверный логин или пароль");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка при входе");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Вход</h2>
      <form onSubmit={handleLogin}>
        <input className="form-control mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="form-control mb-2" placeholder="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-primary" type="submit">Войти</button>
      </form>
    </div>
  );
}