// import express from 'express';
// import { prisma } from '../lib/prisma.js';

// const router = express.Router();

// // CREATE
// router.post('/', async (req, res) => {
//   try {
//     const { title, description, employerId } = req.body;

//     const vacancy = await prisma.vacancy.create({
//       data: {
//         title,
//         description,
//         employerId
//       }
//     });

//     res.status(201).json(vacancy);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET ALL
// router.get('/', async (req, res) => {
//   try {
//     const vacancies = await prisma.vacancy.findMany();

//     res.status(200).json({ vacancies });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     await prisma.application.deleteMany({
//       where: { vacancyId: id }
//     });

//     await prisma.vacancy.delete({
//       where: { id }
//     });

//     res.status(200).json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

import express from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// Создать вакансию (только работодатель)
router.post('/', async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    if (!title || !description || !userId) {
      return res.status(400).json({ error: "Отсутствуют обязательные поля: title, description, userId" });
    }

    const employerProfile = await prisma.employerProfile.findUnique({
      where: { userId }
    });

    if (!employerProfile) {
      return res.status(400).json({ error: "Профиль работодателя не найден" });
    }

    const vacancy = await prisma.vacancy.create({
      data: {
        title,
        description,
        employerId: employerProfile.id,
      },
    });

    res.status(201).json(vacancy);
  } catch (err) {
    console.error("Ошибка создания вакансии:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Получить все вакансии
router.get('/', async (req, res) => {
  try {
    const vacancies = await prisma.vacancy.findMany({
      include: { 
        employer: {
          include: { user: true }
        } 
      }
    });
    res.status(200).json({ vacancies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Удалить вакансию
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.application.deleteMany({ where: { vacancyId: id } });
    await prisma.vacancy.delete({ where: { id } });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;