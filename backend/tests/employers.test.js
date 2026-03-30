import request from 'supertest';
import express from 'express';
import employersRouter from '../routes/employers.js';
import { prisma } from '../lib/prisma.js';

const app = express();
app.use(express.json());
app.use('/employers', employersRouter);

describe('Employers API', () => {
  let userId;

  it('Создание работодателя', async () => {
    const resUser = await prisma.user.create({ data: { email: 'emp@test.com', password: '12345', role: 'employer' } });
    userId = resUser.id;
    const res = await request(app)
      .post('/employers')
      .send({ userId, companyName: 'TestCompany' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('Получение всех работодателей', async () => {
    const res = await request(app).get('/employers');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('Удаление работодателя', async () => {
    const res = await request(app).delete(`/employers/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});