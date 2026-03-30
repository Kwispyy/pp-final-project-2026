import express from 'express';
import cors from 'cors';

import studentsRouter from './routes/students.js';
import employersRouter from './routes/employers.js';
import vacanciesRouter from './routes/vacancies.js';
import applicationsRouter from './routes/applications.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('API is running'));

app.use('/students', studentsRouter);
app.use('/employers', employersRouter);
app.use('/vacancies', vacanciesRouter);
app.use('/applications', applicationsRouter);

export default app;