import express from 'express';
import { prisma } from '../lib/prisma.js';

const applicationsRouter = express.Router();

// Подать заявку
applicationsRouter.post('/', async (req, res) => {
  const { userId, vacancyId } = req.body;
  try {
    const application = await prisma.application.create({
      data: { userId, vacancyId, status: 'PENDING' }
    });
    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Получить все заявки
applicationsRouter.get('/', async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      include: { user: true, vacancy: true }
    });
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Удалить заявку
applicationsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.application.delete({ where: { id } });
    res.json({ success: true, message: 'Заявка удалена' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default applicationsRouter;