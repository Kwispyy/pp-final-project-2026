import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (role === "STUDENT") {
        res = await axios.post("http://localhost:3000/students", { email, password });
      } else if (role === "EMPLOYER") {
        res = await axios.post("http://localhost:3000/employers", { email, password });
      }
      setUser(res.data.user);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Ошибка регистрации");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Регистрация</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Email:</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Пароль:</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Я хочу зарегистрироваться как:</label>
          <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="STUDENT">Студент</option>
            <option value="EMPLOYER">Работодатель</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">Зарегистрироваться</button>
      </form>
    </div>
  );
}