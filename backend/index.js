import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

import { prisma } from './lib/prisma.js';

async function seed() {
  const exists = await prisma.vacancy.findFirst();
  if (exists) return;

  const user = await prisma.user.create({
    data: {
      email: 'seed@test.com',
      password: '123',
      role: 'EMPLOYER'
    }
  });

  const student = await prisma.user.create({
    data: {
      email: 'seed123123@test.com',
      password: '121233',
      role: 'STUDENT'
    }
  });

  const employer = await prisma.employerProfile.create({
    data: {
      userId: user.id,
      companyName: 'SeedCo'
    }
  });

  await prisma.vacancy.create({
    data: {
      title: 'React Intern',
      description: 'Learn React',
      employerId: employer.id
    }
  });
}

seed();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});