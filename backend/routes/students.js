import express from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// Создание студента
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.create({
      data: { email, password, role: "STUDENT" }
    });
    const studentProfile = await prisma.studentProfile.create({
      data: { userId: user.id }
    });
    res.status(201).json({ success: true, user, studentProfile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Получение всех студентов
router.get('/', async (req, res) => {
  try {
    const students = await prisma.studentProfile.findMany({ include: { user: true } });
    res.status(200).json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Удаление студента
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' });

    await prisma.application.deleteMany({ where: { userId } });
    await prisma.resume.deleteMany({ where: { studentId: student.id } });
    await prisma.review.deleteMany({ where: { studentId: student.id } });
    await prisma.studentProfile.delete({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ success: true, message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findFirst({ where: { email, role: "STUDENT" } });
  if (!user || user.password !== password) {
    return res.json({ success: false });
  }
  res.json({ success: true, user });
});

export default router;