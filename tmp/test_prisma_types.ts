import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// This is just to check types in the IDE/compiler
async function test() {
  const fiaas = await prisma.fiaa.findMany();
  const fIAAs = await prisma.fIAA.findMany();
}
