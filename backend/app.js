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

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Job Finder API",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  paths: {
    "/vacancies": {
      get: {
        summary: "Получить вакансии",
        responses: {
          200: { description: "OK" },
        },
      },
      post: {
        summary: "Создать вакансию",
        responses: {
          201: { description: "Created" },
        },
      },
    },
    "/applications": {
      get: {
        summary: "Получить отклики",
        responses: {
          200: { description: "OK" },
        },
      },
      post: {
        summary: "Создать отклик",
        responses: {
          201: { description: "Created" },
        },
      },
    },
    "/students": {
      get: {
        summary: "Получить студентов",
        responses: {
          200: { description: "OK" },
        },
      },
    },
    "/employers": {
      get: {
        summary: "Получить работодателей",
        responses: {
          200: { description: "OK" },
        },
      },
    },
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => res.send('API is running'));

app.use('/students', studentsRouter);
app.use('/employers', employersRouter);
app.use('/vacancies', vacanciesRouter);
app.use('/applications', applicationsRouter);
app.use("/", authRouter);

export default app;