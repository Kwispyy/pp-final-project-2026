import express from 'express';
import { prisma } from '../lib/prisma.js';

const employersRouter = express.Router();

// Создать работодателя
employersRouter.post('/', async (req, res) => {
  const { email, password, companyName } = req.body;
  try {
    const user = await prisma.user.create({
      data: { email, password, role: 'EMPLOYER' }
    });

    const employerProfile = await prisma.employerProfile.create({
      data: { userId: user.id, companyName }
    });

    res.json({ success: true, user, employerProfile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Получить всех работодателей
employersRouter.get('/', async (req, res) => {
  try {
    const employers = await prisma.employerProfile.findMany({
      include: { user: true, vacancies: true }
    });
    res.json({ success: true, employers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Удалить работодателя
employersRouter.delete('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const vacancies = await prisma.vacancy.findMany({ where: { employerId: userId } });
    for (const vacancy of vacancies) {
      await prisma.application.deleteMany({ where: { vacancyId: vacancy.id } });
      await prisma.vacancySkill.deleteMany({ where: { vacancyId: vacancy.id } });
    }
    await prisma.vacancy.deleteMany({ where: { employerId: userId } });
    await prisma.employerProfile.delete({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    res.json({ success: true, message: 'Работодатель и все данные удалены' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default employersRouter;