import request from 'supertest';
import { describe, it, beforeEach, afterAll, expect } from '@jest/globals';
import app from '../app.js';
import { prisma } from '../lib/prisma.js';
import { cleanDb } from './setup.js';

describe('Error Handling & Validation', () => {
  beforeEach(async () => {
    await cleanDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // === AUTH ===
  it('Должен возвращать 400 при регистрации без email', async () => {
  const res = await request(app)
    .post('/register')
    .send({ password: '123', role: 'STUDENT' });

  expect(res.status).toBe(400);
  expect(res.body.error).toContain('обязательны');   // или твой текст ошибки
    });

  it('Должен возвращать 400 при регистрации существующего email', async () => {
    const email = `duplicate_${Date.now()}@test.com`;

    await request(app)
      .post('/register')
      .send({ email, password: '123', role: 'STUDENT' });

    const res = await request(app)
      .post('/register')
      .send({ email, password: '123', role: 'STUDENT' });

    expect(res.status).toBe(400);
  });

  // === VACANCIES ===
  it('Должен возвращать 400 при создании вакансии без title', async () => {
    const res = await request(app)
      .post('/vacancies')
      .send({
        description: 'Test description',
        userId: '123e4567-e89b-12d3-a456-426614174000'
      });

    expect(res.status).toBe(400);
  });

  it('Должен возвращать 400 при создании вакансии без userId', async () => {
    const res = await request(app)
      .post('/vacancies')
      .send({
        title: 'Test Vacancy',
        description: 'Test description'
      });

    expect(res.status).toBe(400);
  });

  // === APPLICATIONS ===
  it('Должен возвращать 400 при создании отклика без userId', async () => {
    const res = await request(app)
      .post('/applications')
      .send({ vacancyId: '123e4567-e89b-12d3-a456-426614174000' });

    expect(res.status).toBe(400);
  });

  it('Должен возвращать 400 при создании отклика без vacancyId', async () => {
    const res = await request(app)
      .post('/applications')
      .send({ userId: '123e4567-e89b-12d3-a456-426614174000' });

    expect(res.status).toBe(400);
  });

  it('Должен возвращать 400 при обновлении статуса без поля status', async () => {
    const res = await request(app)
      .put('/applications/some-fake-id')
      .send({});

    expect(res.status).toBe(400);
  });
});