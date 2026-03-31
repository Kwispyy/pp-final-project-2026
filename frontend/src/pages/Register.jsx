import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = { email, password, role };
      if (role === "EMPLOYER") {
        payload.companyName = companyName || "Без названия";
      }

      const res = await axios.post("http://localhost:3000/register", payload);

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate("/profile");
      } else {
        setError(res.data.error || "Ошибка регистрации");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-4">
        <div className="card">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Регистрация</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Пароль</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Я регистрируюсь как:</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="STUDENT">Студент</option>
                  <option value="EMPLOYER">Работодатель (преподаватель / партнёр)</option>
                </select>
              </div>

              {role === "EMPLOYER" && (
                <div className="mb-3">
                  <label className="form-label">Название компании / кафедры</label>
                  <input
                    type="text"
                    className="form-control"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Например: Кафедра ИИ"
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Регистрируем..." : "Зарегистрироваться"}
              </button>
            </form>

            <div className="text-center mt-3">
              Уже есть аккаунт?{" "}
              <a href="/login" className="text-primary">Войти</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}