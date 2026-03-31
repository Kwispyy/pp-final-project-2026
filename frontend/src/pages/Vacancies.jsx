import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Vacancies({ user }) {
  const [vacancies, setVacancies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/vacancies")
      .then(res => setVacancies(res.data.vacancies || []));

    if (user?.role === "STUDENT") {
      axios.get("http://localhost:3000/applications")
        .then(res => {
          setApplications(res.data.applications?.filter(a => a.userId === user.id) || []);
        });
    }
  }, [user]);

  const hasApplied = (vacancyId) => applications.some(a => a.vacancyId === vacancyId);

  const handleApply = async (vacancyId) => {
    if (!user) return alert("Войдите в систему");
    try {
      await axios.post("http://localhost:3000/applications", { 
        userId: user.id, 
        vacancyId 
      });
      alert("Отклик отправлен!");
      window.location.reload(); // простой рефреш для демо
    } catch (err) {
      alert(err.response?.data?.error || "Ошибка при отклике");
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) {
      return alert("Заполните название и описание вакансии");
    }
    if (user?.role !== "EMPLOYER") {
      return alert("Только работодатель может создавать вакансии");
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/vacancies", {
        title: title.trim(),
        description: description.trim(),
        userId: user.id   // ← это обязательно должно быть
      });
      alert("Вакансия опубликована!");
      setTitle("");
      setDescription("");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Ошибка при создании вакансии");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      {/* Форма создания вакансии для работодателя */}
      {user?.role === "EMPLOYER" && (
        <div className="card mb-5">
          <div className="card-body">
            <h4>Создать новую вакансию</h4>
            <input 
              className="form-control mb-2" 
              placeholder="Название вакансии" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
            <textarea 
              className="form-control mb-3" 
              rows="3" 
              placeholder="Описание вакансии" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
            />
            <button 
              className="btn btn-success w-100" 
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Публикуем..." : "Опубликовать вакансию"}
            </button>
          </div>
        </div>
      )}

      <h2 className="mb-4">Все вакансии в кампусе</h2>
      <div className="row">
        {vacancies.length === 0 ? (
          <p>Вакансий пока нет</p>
        ) : (
          vacancies.map(v => (
            <div key={v.id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{v.title}</h5>
                  <p className="card-text text-muted">{v.description}</p>
                  <p className="text-primary">
                    <strong>{v.employer?.companyName || "Неизвестная компания"}</strong>
                  </p>

                  {user?.role === "STUDENT" && (
                    <button
                      className={`btn w-100 ${hasApplied(v.id) ? "btn-secondary" : "btn-primary"}`}
                      onClick={() => hasApplied(v.id) 
                        ? alert("Вы уже откликнулись на эту вакансию") 
                        : handleApply(v.id)
                      }
                    >
                      {hasApplied(v.id) ? "Отклик отправлен ✓" : "Откликнуться"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}