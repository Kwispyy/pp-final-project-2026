import { useState, useEffect } from "react";
import axios from "axios";

export default function Vacancies({ user }) {
  const [vacancies, setVacancies] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await axios.get("http://localhost:3000/vacancies");
        setVacancies(res.data.vacancies);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchApplications = async () => {
      if (user?.role === "STUDENT") {
        try {
          const res = await axios.get("http://localhost:3000/applications");
          setApplications(res.data.applications);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchVacancies();
    fetchApplications();
  }, [user]);

  const handleApply = async (vacancyId) => {
    try {
      await axios.post("http://localhost:3000/applications", {
        userId: user.id,
        vacancyId,
        status: "Подана"
      });
      setApplications([...applications, { userId: user.id, vacancyId, status: "Подана" }]);
      alert("Отклик успешно отправлен");
    } catch (err) {
      console.error(err);
      alert("Ошибка при отправке отклика");
    }
  };

  const hasApplied = (vacancyId) => {
    return applications.some(app => app.vacancyId === vacancyId && app.userId === user?.id);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Вакансии</h2>
      <div className="row">
        {vacancies.map(v => (
          <div key={v.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{v.title}</h5>
                <p className="card-text flex-grow-1">{v.description}</p>
                {user?.role === "STUDENT" && (
                  <button
                    className={`btn ${hasApplied(v.id) ? "btn-secondary" : "btn-primary"} mt-2`}
                    disabled={hasApplied(v.id)}
                    onClick={() => handleApply(v.id)}
                  >
                    {hasApplied(v.id) ? "Вы уже откликнулись" : "Откликнуться"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}