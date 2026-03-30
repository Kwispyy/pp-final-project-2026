import express from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// Создать студента (User + StudentProfile)
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.create({
      data: { email, password, role: "STUDENT" }
    });

    const studentProfile = await prisma.studentProfile.create({
      data: { userId: user.id }
    });

    res.json({ success: true, user, studentProfile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Получить всех студентов
router.get('/', async (req, res) => {
  try {
    const students = await prisma.studentProfile.findMany({
      include: { user: true }
    });
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Сначала удаляем связанные данные: резюме, отзывы, приложения
    await prisma.application.deleteMany({ where: { userId } });
    await prisma.resume.deleteMany({
      where: { studentId: (await prisma.studentProfile.findUnique({ where: { userId } }))?.id }
    });
    await prisma.review.deleteMany({
      where: { studentId: (await prisma.studentProfile.findUnique({ where: { userId } }))?.id }
    });
    await prisma.studentProfile.delete({ where: { userId } });

    // Потом удаляем самого пользователя
    await prisma.user.delete({ where: { id: userId } });

    res.json({ success: true, message: 'Студент удалён полностью' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;