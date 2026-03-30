import request from 'supertest';
import express from 'express';
import { prisma } from '../lib/prisma.js';
import studentsRouter from '../routes/students.js';

const app = express();
app.use(express.json());
app.use('/students', studentsRouter);

describe('Students API', () => {
  let userId;

  it('Создание студента', async () => {
    const res = await request(app)
      .post('/students')
      .send({ email: 'test@student.com', password: '12345' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    userId = res.body.student.user.id;
  });

  it('Получение всех студентов', async () => {
    const res = await request(app).get('/students');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.students.length).toBeGreaterThan(0);
  });

  it('Удаление студента', async () => {
    const res = await request(app).delete(`/students/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

});