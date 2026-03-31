import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile({ user }) {
  const [applications, setApplications] = useState([]);
  const [myVacancies, setMyVacancies] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Загружаем отклики студента
    axios.get("http://localhost:3000/applications")
      .then(res => {
        const myApps = res.data.applications?.filter(a => a.userId === user.id) || [];
        setApplications(myApps);
      })
      .catch(err => console.error("Ошибка загрузки откликов:", err));

    // Загружаем вакансии работодателя
    if (user.role === "EMPLOYER") {
      axios.get("http://localhost:3000/vacancies")
        .then(res => {
          const mine = res.data.vacancies?.filter(v => v.employer?.userId === user.id) || [];
          setMyVacancies(mine);
        })
        .catch(err => console.error("Ошибка загрузки вакансий:", err));
    }
  }, [user]);

  // Отмена отклика (для студента)
  const cancelApplication = async (applicationId) => {
    if (!window.confirm("Отменить отклик на вакансию?")) return;
    try {
      await axios.delete(`http://localhost:3000/applications/${applicationId}`);
      setApplications(prev => prev.filter(a => a.id !== applicationId));
      alert("Отклик успешно отменён");
    } catch (err) {
      alert(err.response?.data?.error || "Не удалось отменить отклик");
    }
  };

  // Удаление вакансии (для работодателя)
  const deleteVacancy = async (vacancyId) => {
    if (!window.confirm("Удалить вакансию? Все отклики на неё тоже будут удалены.")) return;
    try {
      await axios.delete(`http://localhost:3000/vacancies/${vacancyId}`);
      setMyVacancies(prev => prev.filter(v => v.id !== vacancyId));
      alert("Вакансия удалена");
    } catch (err) {
      alert(err.response?.data?.error || "Не удалось удалить вакансию");
    }
  };

  if (!user) {
    return <div className="container mt-5">Пожалуйста, войдите в систему</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h2>Личный кабинет — {user.role === "STUDENT" ? "Студент" : "Работодатель"}</h2>
          <p><strong>Email:</strong> {user.email}</p>

          {/* === БЛОК ДЛЯ РАБОТОДАТЕЛЯ === */}
          {user.role === "EMPLOYER" && (
            <>
              <h4 className="mt-4">Мои вакансии</h4>
              {myVacancies.length === 0 ? (
                <p className="text-muted">Вы пока не опубликовали ни одной вакансии</p>
              ) : (
                <div className="row">
                  {myVacancies.map(v => (
                    <div key={v.id} className="col-md-6 mb-3">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5>{v.title}</h5>
                          <p className="text-muted">{v.description}</p>
                          <button 
                            className="btn btn-danger btn-sm mt-2"
                            onClick={() => deleteVacancy(v.id)}
                          >
                            Удалить вакансию
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* === БЛОК ДЛЯ СТУДЕНТА === */}
          {user.role === "STUDENT" && (
            <>
              <h4 className="mt-4">Мои отклики</h4>
              {applications.length === 0 ? (
                <p className="text-muted">Пока нет отправленных откликов</p>
              ) : (
                applications.map(a => (
                  <div key={a.id} className="card mb-3">
                    <div className="card-body">
                      <h5>{a.vacancy?.title || "Вакансия удалена"}</h5>
                      <p className="text-muted">{a.vacancy?.description}</p>
                      <span className={`badge bg-${a.status === "APPLIED" ? "primary" : "success"} me-2`}>
                        {a.status}
                      </span>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => cancelApplication(a.id)}
                      >
                        Отменить отклик
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}