import express from 'express';
import { prisma } from '../lib/prisma.js';

const vacanciesRouter = express.Router();

// Создать вакансию
vacanciesRouter.post('/', async (req, res) => {
  const { title, description, employerId, skillIds = [] } = req.body;
  try {
    const vacancy = await prisma.vacancy.create({
      data: {
        title,
        description,
        employerId,
        skills: {
          create: skillIds.map(skillId => ({ skillId }))
        }
      },
      include: { skills: true }
    });
    res.json({ success: true, vacancy });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Получить все вакансии
vacanciesRouter.get('/', async (req, res) => {
  try {
    const vacancies = await prisma.vacancy.findMany({
      include: { employer: true, skills: { include: { skill: true } }, applications: true }
    });
    res.json({ success: true, vacancies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Удалить вакансию
vacanciesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.application.deleteMany({ where: { vacancyId: id } });
    await prisma.vacancySkill.deleteMany({ where: { vacancyId: id } });
    await prisma.vacancy.delete({ where: { id } });
    res.json({ success: true, message: 'Вакансия удалена' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default vacanciesRouter;