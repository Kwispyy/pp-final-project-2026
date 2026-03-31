// import { Link, useNavigate } from "react-router-dom";

// export default function Navbar({ user, setUser }) {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     setUser(null);
//     navigate("/");
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//       <div className="container">
//         <Link className="navbar-brand fw-bold" to="/">JobFinder</Link>
//         <div className="collapse navbar-collapse">
//           <ul className="navbar-nav ms-auto">
//             <li className="nav-item">
//               <Link className="nav-link" to="/vacancies">Вакансии</Link>
//             </li>
//             {!user && (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/login">Вход</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/register">Регистрация</Link>
//                 </li>
//               </>
//             )}
//             {user && (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/profile">Личный кабинет</Link>
//                 </li>
//                 <li className="nav-item">
//                   <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>Выйти</button>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }

import { Link } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">CampusJobs</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/vacancies">Вакансии</Link>
            </li>

            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Вход</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Регистрация</Link>
                </li>
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