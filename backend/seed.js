import { prisma } from "./src/initPrismaClient.js";

async function main() {
  const alice = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@prisma.io",
    },
  });
  console.log("Создан пользователь:", alice);

  const allUsers = await prisma.user.findMany();
  console.log("Все пользователи:", allUsers);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());