import 'dotenv/config';
import app from './app.js';
import { prisma } from './lib/prisma.js';

const PORT = process.env.PORT || 3000;

async function seed() {
  const exists = await prisma.user.findFirst();
  if (exists) return;

  const employerUser = await prisma.user.create({ data: { email: 'seed@test.com', password: '123', role: 'EMPLOYER' } });
  const studentUser = await prisma.user.create({ data: { email: 'student@test.com', password: '123456', role: 'STUDENT' } });

  const employer = await prisma.employerProfile.create({ data: { userId: employerUser.id, companyName: 'SeedCo' } });

  await prisma.vacancy.create({ data: { title: 'React Intern', description: 'Learn React', employerId: employer.id } });
}

seed();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));