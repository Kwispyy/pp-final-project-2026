import { prisma } from '../lib/prisma.js';

export async function cleanDb() {
  await prisma.application.deleteMany({});
  await prisma.vacancy.deleteMany({});
  await prisma.studentProfile.deleteMany({});
  await prisma.employerProfile.deleteMany({});
  await prisma.user.deleteMany({});
}