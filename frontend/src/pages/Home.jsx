import { useNavigate } from "react-router-dom";

export default function Home({ user }) {
  const navigate = useNavigate();

  const handleViewVacancies = () => {
    navigate("/vacancies");
  };

  return (
    <div className="container mt-5 text-center">
      <div className="p-5 bg-light rounded shadow-sm">
        <h1 className="display-4 mb-4">Добро пожаловать в JobFinder</h1>
        <p className="lead mb-4">
          Найдите стажировку или работу в вашем кампусе легко и быстро.
        </p>
        <button 
          className="btn btn-primary btn-lg px-4"
          onClick={handleViewVacancies}
        >
          Просмотреть вакансии
        </button>
      </div>
    </div>
  );
}