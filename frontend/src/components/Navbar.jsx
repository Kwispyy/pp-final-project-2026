import { Link } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-semibold text-primary" to="/">
          CampusJobs
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/vacancies">Вакансии</Link>
            </li>

            {!user && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Вход</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Регистрация</Link></li>
              </>
            )}

            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Личный кабинет</Link>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-danger btn-sm ms-3"
                    onClick={handleLogout}
                  >
                    Выйти
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}