import express from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// Создать работодателя (оставил для совместимости)
router.post('/', async (req, res) => {
  try {
    const { email, password, companyName } = req.body;
    const user = await prisma.user.create({
      data: { email, password, role: "EMPLOYER" }
    });
    const employerProfile = await prisma.employerProfile.create({
      data: { userId: user.id, companyName: companyName || "Без названия" }
    });
    res.status(201).json({ success: true, user, employerProfile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Получить всех работодателей
router.get('/', async (req, res) => {
  try {
    const employers = await prisma.employerProfile.findMany({
      include: { user: true }
    });
    res.status(200).json({ success: true, employers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Удалить работодателя
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const employer = await prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) return res.status(404).json({ success: false, error: 'Employer not found' });

    await prisma.vacancy.deleteMany({ where: { employerId: employer.id } });
    await prisma.employerProfile.delete({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ success: true, message: 'Employer deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;