import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile({ user }) {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await axios.get("http://localhost:3000/applications");
        const myApps = res.data.applications.filter(app => app.userId === user.id);
        setApplications(myApps);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [user]);

  if (!user) return <div className="container mt-4">Авторизуйтесь чтобы увидеть профиль</div>;

  return (
    <div className="container mt-4">
      <h2>Личный кабинет</h2>
      <p>Email: {user.email}</p>
      <h4>Мои отклики:</h4>
      {applications.length === 0 ? (
        <p>Вы ещё не откликались на вакансии</p>
      ) : (
        <ul>
          {applications.map(app => (
            <li key={app.id}>Вакансия ID: {app.vacancyId}, Статус: {app.status}</li>
          ))}
        </ul>
      )}
    </div>
  );
}