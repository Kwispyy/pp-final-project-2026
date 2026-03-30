import express from "express";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// Регистрация
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ success: false, error: "Пользователь уже существует" });

    const user = await prisma.user.create({
      data: { email, password, role },
    });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Логин
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) return res.status(401).json({ success: false, error: "Неверные данные" });
  res.json({ success: true, user });
});

// Текущий пользователь
router.get("/current-user/:id", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ success: false });
  res.json({ success: true, user });
});

export default router;