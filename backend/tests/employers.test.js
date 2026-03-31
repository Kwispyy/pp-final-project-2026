import request from 'supertest';
import { describe, it, beforeEach, afterAll, expect } from '@jest/globals';
import app from '../app.js';
import { prisma } from '../lib/prisma.js';
import { cleanDb } from './setup.js';

describe('Employers CRUD', () => {
  beforeEach(async () => {
    await cleanDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Должен создавать работодателя через /employers', async () => {
    const email = `emp_${Date.now()}@test.com`;

    const res = await request(app)
      .post('/employers')
      .send({
        email: email,
        password: '123',
        companyName: 'Test Company'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.employerProfile).toHaveProperty('id');
    expect(res.body.employerProfile.companyName).toBe('Test Company');
  });

  it('Должен возвращать список всех работодателей', async () => {
    const email = `emp_${Date.now()}@test.com`;

    // Создаём одного работодателя
    const createRes = await request(app)
      .post('/employers')
      .send({
        email: email,
        password: '123',
        companyName: 'Test Company'
      });

    // Получаем список
    const res = await request(app).get('/employers');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.employers)).toBe(true);
    expect(res.body.employers.length).toBeGreaterThan(0);

    // Проверяем, что созданный работодатель присутствует в списке
    const found = res.body.employers.some(e => 
      e.user && e.user.email === email
    );
    expect(found).toBe(true);
  });

  it('Должен удалять работодателя', async () => {
    const email = `emp_${Date.now()}@test.com`;

    // Создаём работодателя
    const createRes = await request(app)
      .post('/employers')
      .send({
        email: email,
        password: '123',
        companyName: 'Test Company'
      });

    const userId = createRes.body.user.id;

    // Удаляем
    const res = await request(app).delete(`/employers/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});