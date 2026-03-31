import express from "express";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, role, companyName } = req.body;

  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(400).json({ success: false, error: "Пользователь уже существует" });
    }

    const user = await prisma.user.create({
      data: { email, password, role }
    });

    if (role === "STUDENT") {
      await prisma.studentProfile.create({ data: { userId: user.id } });
    } else if (role === "EMPLOYER") {
      await prisma.employerProfile.create({
        data: { userId: user.id, companyName: companyName || "Без названия" }
      });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { student: true, employer: true }
    });

    res.json({ success: true, user: fullUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { student: true, employer: true }
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, error: "Неверный email или пароль" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;