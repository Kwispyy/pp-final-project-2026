import express from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// CREATE отклик
router.post('/', async (req, res) => {
  try {
    const { userId, vacancyId } = req.body;
    if (!userId || !vacancyId) return res.status(400).json({ error: "userId и vacancyId обязательны" });

    const application = await prisma.application.create({
      data: { userId, vacancyId, status: "APPLIED" },
      include: { vacancy: true }
    });
    res.status(201).json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET все отклики
router.get('/', async (req, res) => {
  try {
    const applications = await prisma.application.findMany({ include: { vacancy: true } });
    res.status(200).json({ applications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE статус отклика (новое)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "status обязателен" });

    const application = await prisma.application.update({
      where: { id },
      data: { status },
      include: { vacancy: true }
    });
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE отклик
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.application.delete({ where: { id } });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;