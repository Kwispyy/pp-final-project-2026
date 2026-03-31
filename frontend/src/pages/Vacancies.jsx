import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Vacancies({ user }) {
  const [vacancies, setVacancies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/vacancies")
      .then(res => setVacancies(res.data.vacancies || []));

    if (user?.role === "STUDENT") {
      axios.get("http://localhost:3000/applications")
        .then(res => setApplications(res.data.applications?.filter(a => a.userId === user.id) || []));
    }
  }, [user]);

  const filteredVacancies = vacancies.filter(v =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasApplied = (vacancyId) => applications.some(a => a.vacancyId === vacancyId);

  const handleApply = async (vacancyId) => {
    if (!user) return;
    try {
      await axios.post("http://localhost:3000/applications", { userId: user.id, vacancyId });
      alert("Отклик отправлен!"); // позже заменим на toast
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || "Ошибка");
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) return alert("Заполните все поля");
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/vacancies", { title: title.trim(), description: description.trim(), userId: user.id });
      alert("Вакансия опубликована!");
      setTitle("");
      setDescription("");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">

      {/* Поиск по ключевым словам */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Поиск по названию или описанию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Форма создания для работодателя */}
      {user?.role === "EMPLOYER" && (
        <div className="card mb-5 shadow-sm">
          <div className="card-body">
            <h4 className="mb-3">Опубликовать новую вакансию</h4>
            <input className="form-control mb-3" placeholder="Название" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea className="form-control mb-3" rows="3" placeholder="Описание" value={description} onChange={e => setDescription(e.target.value)} />
            <button className="btn btn-success w-100" onClick={handleCreate} disabled={loading}>
              {loading ? "Публикуем..." : "Опубликовать"}
            </button>
          </div>
        </div>
      )}

      <h2 className="mb-4">Все вакансии ({filteredVacancies.length})</h2>

      <div className="row g-4">
        {filteredVacancies.length === 0 ? (
          <p className="text-muted">Ничего не найдено по запросу «{searchTerm}»</p>
        ) : (
          filteredVacancies.map(v => (
            <div key={v.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{v.title}</h5>
                  <p className="card-text text-muted flex-grow-1">{v.description}</p>
                  <p className="text-primary small fw-medium mb-3">
                    {v.employer?.companyName || "Неизвестная компания"}
                  </p>

                  {user?.role === "STUDENT" && (
                    <button
                      className={`btn w-100 mt-auto ${hasApplied(v.id) ? "btn-secondary" : "btn-primary"}`}
                      onClick={() => hasApplied(v.id) ? alert("Уже откликнулись") : handleApply(v.id)}
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