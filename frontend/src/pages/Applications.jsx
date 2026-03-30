import { useEffect, useState } from "react";
import axios from "axios";

export default function Applications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    async function fetchApplications() {
      const res = await axios.get("http://localhost:3000/applications");
      setApplications(res.data.applications || []);
    }
    fetchApplications();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Мои отклики</h2>
      {applications.length === 0 ? (
        <p>Откликов нет</p>
      ) : (
        applications.map((a) => (
          <div key={a.id} className="card mb-2">
            <div className="card-body">
              <p>
                Вакансия: <strong>{a.vacancyTitle}</strong>
              </p>
              <p>Статус: {a.status}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}