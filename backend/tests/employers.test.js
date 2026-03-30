import request from 'supertest';
import { describe, it, beforeEach, afterAll, expect } from '@jest/globals';
import app from '../app.js';
import { prisma } from '../lib/prisma.js';
import { cleanDb } from './setup.js';

describe('Employers CRUD', () => {
  let userId;

  beforeEach(async () => {
    await cleanDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Добавление работодателя', async () => {
    const res = await request(app)
      .post('/employers')
      .send({
        email: `emp_${Date.now()}@test.com`,
        password: '123',
        companyName: 'TestCo'
      });

    expect(res.status).toBe(201);
    userId = res.body.user.id;
  });

  it('Просмотр работодателей', async () => {
    const create = await request(app)
      .post('/employers')
      .send({
        email: `emp_${Date.now()}@test.com`,
        password: '123',
        companyName: 'TestCo'
      });

    const res = await request(app).get('/employers');

    expect(res.status).toBe(200);
    expect(res.body.employers.some(e => e.user.id === create.body.user.id)).toBe(true);
  });

  it('Удаление работодателя', async () => {
    const create = await request(app)
      .post('/employers')
      .send({
        email: `emp_${Date.now()}@test.com`,
        password: '123',
        companyName: 'TestCo'
      });

    const res = await request(app).delete(`/employers/${create.body.user.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});