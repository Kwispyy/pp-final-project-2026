import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/students/register", { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        navigate("/profile");
      } else {
        alert("Ошибка регистрации");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка регистрации");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <input className="form-control mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="form-control mb-2" placeholder="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-primary" type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}