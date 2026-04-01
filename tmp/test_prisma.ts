import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        _count: { select: { students: true } },
        teachers: true
      }
    });
    console.log('Success:', classes.length);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
