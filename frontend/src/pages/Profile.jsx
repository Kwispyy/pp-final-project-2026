import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile({ user }) {
  const [applications, setApplications] = useState([]);
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        if (user.role === "STUDENT") {
          const res = await axios.get("http://localhost:3000/applications");
          const myApps = res.data.applications.filter((app) => app.userId === user.id);
          setApplications(myApps);
        } else if (user.role === "EMPLOYER") {
          const res = await axios.get("http://localhost:3000/vacancies");
          const myVacancies = res.data.vacancies.filter((v) => v.employerId === user.id);
          setVacancies(myVacancies);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user]);

  if (!user)
    return <div className="container mt-4">Please log in to see your profile</div>;

  return (
    <div className="container mt-4">
      <h2>Profile</h2>
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{user.email}</h5>
          <p className="card-text">Role: {user.role}</p>
        </div>
      </div>

      {user.role === "STUDENT" && (
        <>
          <h4>My Applications</h4>
          {applications.map((app) => (
            <div className="card mb-2" key={app.id}>
              <div className="card-body">
                <p className="card-text">Vacancy ID: {app.vacancyId}</p>
                <p className="card-text">Status: {app.status}</p>
              </div>
            </div>
          ))}
        </>
      )}

      {user.role === "EMPLOYER" && (
        <>
          <h4>My Vacancies</h4>
          {vacancies.map((vac) => (
            <div className="card mb-2" key={vac.id}>
              <div className="card-body">
                <h5 className="card-title">{vac.title}</h5>
                <p className="card-text">{vac.description}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}