import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-3">CampusJobs — УрФУ</h1>
      <p className="lead mb-4">Поиск стажировок и временной работы в кампусе</p>
      <div className="d-flex justify-content-center gap-3">
        <Link to="/vacancies" className="btn btn-primary btn-lg">Смотреть вакансии</Link>
        <Link to="/register" className="btn btn-outline-primary btn-lg">Зарегистрироваться</Link>
      </div>
    </div>
  );
}