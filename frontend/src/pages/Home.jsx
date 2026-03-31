import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mt-5">

      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8">
          <h1 className="display-4 fw-bold text-dark mb-3">
            CampusJobs
          </h1>
          <h2 className="text-primary fs-3 mb-4">
            Стажировки и работа внутри УрФУ
          </h2>
          
          <p className="lead text-muted mb-5">
            Единая платформа для студентов и работодателей университета.<br />
            Находите подработку, стажировки и исследовательские проекты быстро и удобно.
          </p>

          <div className="d-flex justify-content-center flex-wrap gap-3">
            <Link to="/vacancies" className="btn btn-primary btn-lg px-5 py-3">
              Смотреть вакансии
            </Link>
            <Link to="/register" className="btn btn-outline-primary btn-lg px-5 py-3">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-5">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm text-center">
            <div className="card-body py-4">
              <h5 className="card-title">Быстрый поиск</h5>
              <p className="text-muted">
                Удобные фильтры и поиск по ключевым словам специально для УрФУ
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm text-center">
            <div className="card-body py-4">
              <h5 className="card-title">Простая подача</h5>
              <p className="text-muted">
                Загружайте резюме и сопроводительное письмо в один клик
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm text-center">
            <div className="card-body py-4">
              <h5 className="card-title">Отслеживание статуса</h5>
              <p className="text-muted">
                Все отклики и собеседования — в вашем личном кабинете
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}