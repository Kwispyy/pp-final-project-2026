import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { PrismaClient } from './generated/prisma/index.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const app = express();

app.use(cors());
app.use(express.json());

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

// тесты
app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/test-db', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ success: true,count: users.length, users });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
  
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});