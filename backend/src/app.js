import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { prisma } from "./initPrismaClient.js";

const app = express();

app.use(cors()); //?
app.use(express.json());


// тесты
app.get('/', (req, res) => {
  res.send('API is running');
});

app.get("/test-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    console.error("Ошибка при запросе к БД:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});