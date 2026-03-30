import express from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// Создание работодателя
router.post('/', async (req, res) => {
  try {
    const { email, password, companyName } = req.body;
    const user = await prisma.user.create({
      data: { email, password, role: "EMPLOYER" }
    });
    const employerProfile = await prisma.employerProfile.create({
      data: { userId: user.id, companyName }
    });
    res.status(201).json({ success: true, user, employerProfile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Получение всех работодателей
router.get('/', async (req, res) => {
  try {
    const employers = await prisma.employerProfile.findMany({ include: { user: true } });
    res.status(200).json({ success: true, employers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Удаление работодателя
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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findFirst({ where: { email, role: "EMPLOYER" } });
  if (!user || user.password !== password) {
    return res.json({ success: false });
  }
  res.json({ success: true, user });
});

export default router;