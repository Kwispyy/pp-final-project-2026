import express from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  try {
    const { title, description, employerId } = req.body;

    const vacancy = await prisma.vacancy.create({
      data: {
        title,
        description,
        employerId
      }
    });

    res.status(201).json(vacancy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET ALL
router.get('/', async (req, res) => {
  try {
    const vacancies = await prisma.vacancy.findMany();

    res.status(200).json({ vacancies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.application.deleteMany({
      where: { vacancyId: id }
    });

    await prisma.vacancy.delete({
      where: { id }
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;