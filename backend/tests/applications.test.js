import request from 'supertest';
import { describe, it, beforeEach, afterAll, expect } from '@jest/globals';
import app from '../app.js';
import { prisma } from '../lib/prisma.js';
import { cleanDb } from './setup.js';

describe('Applications CRUD', () => {
  let studentId;
  let vacancyId;

  beforeEach(async () => {
    await cleanDb();

    // Создаём студента
    const studentUser = await prisma.user.create({
      data: { email: `student_${Date.now()}@test.com`, password: '123', role: 'STUDENT' }
    });
    await prisma.studentProfile.create({ data: { userId: studentUser.id } });
    studentId = studentUser.id;

    // Создаём работодателя и вакансию
    const empUser = await prisma.user.create({
      data: { email: `emp_${Date.now()}@test.com`, password: '123', role: 'EMPLOYER' }
    });
    const employer = await prisma.employerProfile.create({
      data: { userId: empUser.id, companyName: 'Test Company' }
    });

    const vacancy = await prisma.vacancy.create({
      data: {
        title: 'Test Vacancy',
        description: 'Test description',
        employerId: employer.id
      }
    });
    vacancyId = vacancy.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Должен создавать отклик', async () => {
    const res = await request(app)
      .post('/applications')
      .send({ userId: studentId, vacancyId });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('APPLIED');
  });

  it('Должен возвращать список откликов', async () => {
    await request(app).post('/applications').send({ userId: studentId, vacancyId });

    const res = await request(app).get('/applications');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.applications)).toBe(true);
    expect(res.body.applications.length).toBeGreaterThan(0);
  });

  it('Должен обновлять статус отклика', async () => {
    const createRes = await request(app)
      .post('/applications')
      .send({ userId: studentId, vacancyId });

    const res = await request(app)
      .put(`/applications/${createRes.body.id}`)
      .send({ status: 'INTERVIEW' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('INTERVIEW');
  });

  it('Должен удалять отклик', async () => {
    const createRes = await request(app)
      .post('/applications')
      .send({ userId: studentId, vacancyId });

    const res = await request(app).delete(`/applications/${createRes.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});