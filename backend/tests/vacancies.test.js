import request from 'supertest';
import { describe, it, beforeEach, afterAll, expect } from '@jest/globals';
import app from '../app.js';
import { prisma } from '../lib/prisma.js';
import { cleanDb } from './setup.js';

describe('Vacancies CRUD', () => {
  let employerUserId;

  beforeEach(async () => {
    await cleanDb();

    const user = await prisma.user.create({
      data: {
        email: `emp_${Date.now()}@test.com`,
        password: '123',
        role: 'EMPLOYER'
      }
    });

    await prisma.employerProfile.create({
      data: { userId: user.id, companyName: 'TestCo' }
    });

    employerUserId = user.id;   // ← важно: используем userId, а не employer.id
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Должен создавать вакансию', async () => {
    const res = await request(app)
      .post('/vacancies')
      .send({
        title: 'Frontend Intern',
        description: 'React + TypeScript',
        userId: employerUserId
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Frontend Intern');
  });

  it('Должен возвращать список вакансий', async () => {
    await request(app).post('/vacancies').send({
      title: 'Test Vacancy',
      description: 'Test',
      userId: employerUserId
    });

    const res = await request(app).get('/vacancies');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.vacancies)).toBe(true);
    expect(res.body.vacancies.length).toBeGreaterThan(0);
  });

  it('Должен удалять вакансию', async () => {
    const createRes = await request(app).post('/vacancies').send({
      title: 'To Delete',
      description: 'Test',
      userId: employerUserId
    });

    const res = await request(app).delete(`/vacancies/${createRes.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});