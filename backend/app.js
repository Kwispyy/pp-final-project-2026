import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import studentsRouter from './routes/students.js';
import employersRouter from './routes/employers.js';
import vacanciesRouter from './routes/vacancies.js';
import applicationsRouter from './routes/applications.js';
import authRouter from "./routes/auth.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// ==================== SWAGGER (статический вариант) ====================
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "CampusJobs API",
    version: "1.0.0",
    description: "API для платформы поиска стажировок и временной работы в УрФУ",
  },
  servers: [
    { url: "http://localhost:3000" }
  ],
  paths: {
    "/register": {
      post: { summary: "Регистрация пользователя (студент или работодатель)" }
    },
    "/login": {
      post: { summary: "Авторизация пользователя" }
    },
    "/vacancies": {
      get: { summary: "Получить все вакансии" },
      post: { summary: "Создать новую вакансию (только работодатель)" }
    },
    "/vacancies/{id}": {
      delete: { summary: "Удалить вакансию" }
    },
    "/applications": {
      get: { summary: "Получить все отклики" },
      post: { summary: "Создать отклик на вакансию" }
    },
    "/applications/{id}": {
      put: { summary: "Обновить статус отклика" },
      delete: { summary: "Удалить (отменить) отклик" }
    },
    "/students": {
      get: { summary: "Получить всех студентов" }
    },
    "/employers": {
      get: { summary: "Получить всех работодателей" }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// =====================================================================

app.get('/', (req, res) => res.send('CampusJobs API is running'));

app.use("/", authRouter);
app.use('/students', studentsRouter);
app.use('/employers', employersRouter);
app.use('/vacancies', vacanciesRouter);
app.use('/applications', applicationsRouter);

export default app;