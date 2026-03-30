import { useEffect, useState } from "react";
import axios from "axios";

export default function Vacancies({ user }) {
  const [vacancies, setVacancies] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resVac = await axios.get("http://localhost:3000/vacancies");
        setVacancies(resVac.data.vacancies);

        if (user?.role === "STUDENT") {
          const resApp = await axios.get("http://localhost:3000/applications");
          setApplications(resApp.data.applications);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  const hasApplied = (vacancyId) => {
    return applications.some(
      (app) => app.vacancyId === vacancyId && app.userId === user?.id
    );
  };

  const handleApply = async (vacancyId) => {
    try {
      await axios.post("http://localhost:3000/applications", {
        userId: user.id,
        vacancyId,
        status: "APPLIED"
      });
      setApplications([...applications, { vacancyId, userId: user.id, status: "APPLIED" }]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Vacancies</h2>
      {vacancies.map((vac) => (
        <div className="card mb-2" key={vac.id}>
          <div className="card-body">
            <h5 className="card-title">{vac.title}</h5>
            <p className="card-text">{vac.description}</p>
            {user?.role === "STUDENT" && (
              <button
                className="btn btn-primary"
                disabled={hasApplied(vac.id)}
                onClick={() => handleApply(vac.id)}
              >
                {hasApplied(vac.id) ? "Applied" : "Apply"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}