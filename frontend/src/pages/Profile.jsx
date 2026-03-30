import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile({ user }) {
  const [applications, setApplications] = useState([]);
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (user?.role === "STUDENT") {
        try {
          const res = await axios.get("http://localhost:3000/applications");
          const myApps = res.data.applications.filter(app => app.userId === user.id);
          setApplications(myApps);
        } catch (err) {
          console.error(err);
        }
      }
    };

    const fetchVacancies = async () => {
      if (user?.role === "EMPLOYER") {
        try {
          const res = await axios.get("http://localhost:3000/vacancies");
          const myVacancies = res.data.vacancies.filter(v => v.employerId === user.id);
          setVacancies(myVacancies);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchApplications();
    fetchVacancies();
  }, [user]);

  if (!user) return <div className="container mt-4 text-center">Авторизуйтесь чтобы увидеть профиль</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Личный кабинет</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Роль:</strong> {user.role}</p>

      {user.role === "STUDENT" && (
        <>
          <h4 className="mt-4">Мои отклики</h4>
          {applications.length === 0 ? (
            <p>Вы ещё не откликались на вакансии</p>
          ) : (
            <ul className="list-group">
              {applications.map(app => (
                <li key={app.id} className="list-group-item d-flex justify-content-between align-items-center">
                  Вакансия ID: {app.vacancyId}
                  <span className="badge bg-primary rounded-pill">{app.status}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {user.role === "EMPLOYER" && (
        <>
          <h4 className="mt-4">Мои вакансии</h4>
          {vacancies.length === 0 ? (
            <p>Вы ещё не добавили вакансии</p>
          ) : (
            <ul className="list-group">
              {vacancies.map(v => (
                <li key={v.id} className="list-group-item">
                  <strong>{v.title}</strong>: {v.description}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}