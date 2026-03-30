import request from 'supertest';
import { describe, it, beforeEach, afterAll, expect } from '@jest/globals';
import app from '../app.js';
import { prisma } from '../lib/prisma.js';
import { cleanDb } from './setup.js';

describe('Applications CRUD', () => {
  let userId;
  let vacancyId;
  let applicationId;

  beforeEach(async () => {
    await cleanDb();

    const user = await prisma.user.create({
      data: {
        email: `student_${Date.now()}@test.com`,
        password: '123',
        role: 'STUDENT'
      }
    });

    await prisma.studentProfile.create({
      data: { userId: user.id }
    });

    userId = user.id;

    const empUser = await prisma.user.create({
      data: {
        email: `emp_${Date.now()}@test.com`,
        password: '123',
        role: 'EMPLOYER'
      }
    });

    const employer = await prisma.employerProfile.create({
      data: {
        userId: empUser.id,
        companyName: 'TestCo'
      }
    });

    const vacancy = await prisma.vacancy.create({
      data: {
        title: 'Backend',
        description: 'Node.js',
        employerId: employer.id
      }
    });

    vacancyId = vacancy.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Добавление заявки', async () => {
    const res = await request(app)
      .post('/applications')
      .send({
        userId,
        vacancyId,
        status: 'NEW'
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('NEW');

    applicationId = res.body.id;
  });

  it('Просмотр заявок', async () => {
    const create = await request(app).post('/applications').send({
      userId,
      vacancyId,
      status: 'NEW'
    });

    const res = await request(app).get('/applications');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.applications)).toBe(true);
    expect(res.body.applications.some(a => a.id === create.body.id)).toBe(true);
  });

  it('Обновление заявки', async () => {
    const create = await request(app).post('/applications').send({
      userId,
      vacancyId,
      status: 'NEW'
    });

    const res = await request(app)
      .put(`/applications/${create.body.id}`)
      .send({ status: 'ACCEPTED' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ACCEPTED');
  });

  it('Удаление заявки', async () => {
    const create = await request(app).post('/applications').send({
      userId,
      vacancyId,
      status: 'NEW'
    });

    const res = await request(app).delete(`/applications/${create.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});