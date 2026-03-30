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

  it('Добавление студента', async () => {
    const res = await request(app)
      .post('/students')
      .send({
        email: `student_${Date.now()}@test.com`,
        password: '123'
      });

    expect(res.status).toBe(201);
  });

  it('Просмотр студентов', async () => {
    const create = await request(app)
      .post('/students')
      .send({
        email: `student_${Date.now()}@test.com`,
        password: '123'
      });

    const res = await request(app).get('/students');

    expect(res.status).toBe(200);
    expect(res.body.students.some(s => s.user.id === create.body.user.id)).toBe(true);
  });

  it('Удаление студента', async () => {
    const create = await request(app)
      .post('/students')
      .send({
        email: `student_${Date.now()}@test.com`,
        password: '123'
      });

    const res = await request(app).delete(`/students/${create.body.user.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});