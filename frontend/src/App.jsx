import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Vacancies from "./pages/Vacancies.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  // Загружаем пользователя из localStorage один раз при инициализации
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/vacancies" element={<Vacancies user={user} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;