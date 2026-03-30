import request from 'supertest';
import { describe, it, beforeEach, afterAll, expect } from '@jest/globals';
import app from '../app.js';
import { prisma } from '../lib/prisma.js';
import { cleanDb } from './setup.js';

describe('Vacancies CRUD', () => {
  let employerId;

  beforeEach(async () => {
    await cleanDb();

    const user = await prisma.user.create({
      data: {
        email: `emp_${Date.now()}@test.com`,
        password: '123',
        role: 'EMPLOYER'
      }
    });

    const employer = await prisma.employerProfile.create({
      data: {
        userId: user.id,
        companyName: 'TestCo'
      }
    });

    employerId = employer.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Добавление вакансии', async () => {
    const res = await request(app)
      .post('/vacancies')
      .send({
        title: 'Backend Dev',
        description: 'Node.js dev',
        employerId
      });

    expect(res.status).toBe(201);
  });

  it('Просмотр вакансий', async () => {
    const create = await request(app)
      .post('/vacancies')
      .send({
        title: 'Backend Dev',
        description: 'Node.js dev',
        employerId
      });

    const res = await request(app).get('/vacancies');

    expect(res.status).toBe(200);
    expect(res.body.vacancies.some(v => v.id === create.body.id)).toBe(true);
  });

  it('Удаление вакансии', async () => {
    const create = await request(app)
      .post('/vacancies')
      .send({
        title: 'Backend Dev',
        description: 'Node.js dev',
        employerId
      });

    const res = await request(app).delete(`/vacancies/${create.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});