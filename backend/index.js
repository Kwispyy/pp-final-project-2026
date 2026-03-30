import { prisma } from "./lib/prisma.js"
import 'dotenv/config';
import express from 'express';
import cors from 'cors';


import studentsRouter from './routes/students.js';
import employersRouter from './routes/employers.js';
import vacanciesRouter from './routes/vacancies.js';
import applicationsRouter from './routes/applications.js';

const app = express();
app.use(cors());
app.use(express.json());

// тесты
app.get('/', (req, res) => {
  res.send('API is running');
});

// все маршруты
app.use("/students", studentsRouter);
app.use("/employers", employersRouter);
app.use("/vacancies", vacanciesRouter);
app.use("/applications", applicationsRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});