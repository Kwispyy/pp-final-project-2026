import request from 'supertest';
import { describe, it, beforeEach, afterAll, expect } from '@jest/globals';
import app from '../app.js';
import { prisma } from '../lib/prisma.js';
import { cleanDb } from './setup.js';

describe('Students CRUD', () => {
  beforeEach(async () => {
    await cleanDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Должен создавать студента через /students', async () => {
    const email = `student_${Date.now()}@test.com`;

    const res = await request(app)
      .post('/students')
      .send({
        email: email,
        password: '123'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty('id');
  });

  it('Должен возвращать список всех студентов', async () => {
    const email = `student_${Date.now()}@test.com`;

    // Создаём студента
    await request(app).post('/students').send({
      email: email,
      password: '123'
    });

    const res = await request(app).get('/students');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.students)).toBe(true);
    expect(res.body.students.length).toBeGreaterThan(0);

    // Проверяем, что студент появился в списке
    const found = res.body.students.some(s => 
      s.user && s.user.email === email
    );
    expect(found).toBe(true);
  });

  it('Должен удалять студента', async () => {
    const email = `student_${Date.now()}@test.com`;

    // Создаём студента
    const createRes = await request(app).post('/students').send({
      email: email,
      password: '123'
    });

    const userId = createRes.body.user.id;

    // Удаляем
    const res = await request(app).delete(`/students/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});