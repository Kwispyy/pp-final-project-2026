import { useState, useEffect } from "react";
import axios from "axios";

export default function Vacancies({ user }) {
  const [vacancies, setVacancies] = useState([]);
  const [applications, setApplications] = useState([]);

  const fetchVacancies = async () => {
    try {
      const res = await axios.get("http://localhost:3000/vacancies");
      setVacancies(res.data.vacancies);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/applications");
      setApplications(res.data.applications);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (vacancyId) => {
    try {
      const res = await axios.post("http://localhost:3000/applications", {
        userId: user.id,
        vacancyId,
        status: "APPLIED"
      });
      setApplications(prev => [...prev, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const hasApplied = (vacancyId) => {
    return applications.some(app => app.vacancyId === vacancyId && app.userId === user?.id);
  };

  useEffect(() => {
    (async () => {
      await fetchVacancies();
      if (user?.role === "STUDENT") await fetchApplications();
    })();
  }, [user]);

  return (
    <div className="container mt-4">
      <h2>Доступные вакансии</h2>
      {vacancies.map(v => (
        <div key={v.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{v.title}</h5>
            <p className="card-text">{v.description}</p>
            {user?.role === "STUDENT" && (
              <button
                className="btn btn-primary"
                disabled={hasApplied(v.id)}
                onClick={() => handleApply(v.id)}
              >
                {hasApplied(v.id) ? "Вы уже откликнулись" : "Откликнуться"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}