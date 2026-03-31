// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function Login({ setUser }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       let res = await axios.post("http://localhost:3000/students/login", { email, password });
//       if (!res.data.success) {
//         res = await axios.post("http://localhost:3000/employers/login", { email, password });
//         if (!res.data.success) {
//           alert("Неверный email или пароль");
//           return;
//         }
//       }
//       setUser(res.data.user);
//       navigate("/profile");
//     } catch (err) {
//       console.error(err);
//       alert("Ошибка входа");
//     }
//   };

//   return (
//     <div className="container mt-5" style={{ maxWidth: "400px" }}>
//       <h2 className="mb-4 text-center">Вход</h2>
//       <form onSubmit={handleLogin}>
//         <div className="mb-3">
//           <label>Email:</label>
//           <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         </div>

//         <div className="mb-3">
//           <label>Пароль:</label>
//           <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         </div>

//         <button type="submit" className="btn btn-primary w-100">Войти</button>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/login", { 
        email, 
        password 
      });

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate("/profile");
      } else {
        setError("Неверный email или пароль");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Ошибка входа. Проверьте данные.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-4">
        <div className="card">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Вход в CampusJobs</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleLogin}>
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

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Входим..." : "Войти"}
              </button>
            </form>

            <div className="text-center mt-3">
              Нет аккаунта?{" "}
              <a href="/register" className="text-primary">Зарегистрироваться</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}