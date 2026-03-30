import request from 'supertest';
import express from 'express';
import applicationsRouter from '../routes/applications.js';
import { prisma } from '../lib/prisma.js';

const app = express();
app.use(express.json());
app.use('/applications', applicationsRouter);

describe('Applications API', () => {
  let userId, vacancyId, appId;

  beforeAll(async () => {
    const user = await prisma.user.create({ data: { email: 'student@test.com', password: '123', role: 'student' } });
    const student = await prisma.studentProfile.create({ data: { userId: user.id } });
    const empUser = await prisma.user.create({ data: { email: 'emp@test.com', password: '123', role: 'employer' } });
    const employer = await prisma.employerProfile.create({ data: { userId: empUser.id, companyName: 'TestCompany' } });
    const vacancy = await prisma.vacancy.create({ data: { title: 'Intern', description: 'Desc', employerId: employer.id } });

    userId = student.userId;
    vacancyId = vacancy.id;
  });

  it('Создание заявки', async () => {
    const res = await request(app).post('/applications').send({ userId, vacancyId });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    appId = res.body.application.id;
  });

  it('Получение всех заявок пользователя', async () => {
    const res = await request(app).get(`/applications/user/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

});