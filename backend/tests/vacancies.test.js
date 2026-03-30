import request from 'supertest';
import express from 'express';
import vacanciesRouter from '../routes/vacancies.js';
import { prisma } from '../lib/prisma.js';

const app = express();
app.use(express.json());
app.use('/vacancies', vacanciesRouter);

describe('Vacancies API', () => {
  let employerId, vacancyId;

  beforeAll(async () => {
    const user = await prisma.user.create({ data: { email: 'emp@test.com', password: '123', role: 'employer' } });
    const employer = await prisma.employerProfile.create({ data: { userId: user.id, companyName: 'TestCompany' } });
    employerId = employer.id;
  });

  it('Создание вакансии', async () => {
    const res = await request(app)
      .post('/vacancies')
      .send({ title: 'Junior Dev', description: 'Test description', employerId });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    vacancyId = res.body.vacancy.id;
  });

  it('Получение всех вакансий', async () => {
    const res = await request(app).get('/vacancies');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('Удаление вакансии', async () => {
    const res = await request(app).delete(`/vacancies/${vacancyId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});