import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // наш CSS

function App() {
  const [student, setStudent] = useState(null);
  const [employer, setEmployer] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [error, setError] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingVacancies, setLoadingVacancies] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        // 1️⃣ Попробуем получить студента
        const studentsRes = await axios.get("http://localhost:3000/students");
        const students = studentsRes.data.students;
        if (Array.isArray(students) && students.length > 0) {
          setStudent(students[0]);
        } else {
          // 2️⃣ Если студентов нет — пробуем работодателей
          const employersRes = await axios.get("http://localhost:3000/employers");
          const employers = employersRes.data.employers;
          if (Array.isArray(employers) && employers.length > 0) {
            setEmployer(employers[0]);
          } else {
            setError("Пользователи не найдены");
          }
        }
      } catch (err) {
        console.error("Ошибка загрузки пользователя:", err);
        setError("Ошибка загрузки пользователя");
      } finally {
        setLoadingUser(false);
      }

      try {
        // 3️⃣ Загружаем вакансии
        const vacanciesRes = await axios.get("http://localhost:3000/vacancies");
        const vacanciesArray = Array.isArray(vacanciesRes.data.vacancies)
          ? vacanciesRes.data.vacancies
          : [];
        setVacancies(vacanciesArray);
      } catch (err) {
        console.error("Ошибка загрузки вакансий:", err);
        setError("Ошибка загрузки вакансий");
      } finally {
        setLoadingVacancies(false);
      }
    }

    init();
  }, []);

  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (loadingUser) return <div className="mt-4 loading">Загрузка пользователя...</div>;
  if (!student && !employer) return <div className="mt-4">Пользователь не найден</div>;

  const currentUser = student || employer;
  const name = student ? currentUser.user.email : currentUser.companyName;

  return (
    <div className="container mt-4">
      <h1>Вакансии</h1>
      <p>Привет, <strong>{name}</strong></p>

      {loadingVacancies && <p className="loading">Загрузка вакансий...</p>}
      {!loadingVacancies && vacancies.length === 0 && <p>Вакансии не найдены</p>}

      {vacancies.map((v) => (
        <div key={v.id} className="card mb-3 vacancy-card">
          <div className="card-body">
            <h5 className="card-title">{v.title}</h5>
            <p className="card-text">{v.description}</p>
            <button
              className="btn btn-primary"
              onClick={() => alert(`Отклик на вакансию ${v.id}`)}
            >
              Откликнуться
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;