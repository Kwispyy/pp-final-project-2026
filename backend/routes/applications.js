import express from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  try {
    const { userId, vacancyId, status } = req.body;

    const application = await prisma.application.create({
      data: {
        userId,
        vacancyId,
        status
      }
    });

    res.status(201).json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET ALL
router.get('/', async (req, res) => {
  try {
    const applications = await prisma.application.findMany();

    res.status(200).json({ applications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await prisma.application.update({
      where: { id },
      data: { status }
    });

    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.application.delete({
      where: { id }
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;