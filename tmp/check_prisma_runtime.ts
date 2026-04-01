import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const dmmf = (prisma as any)._dmmf;
    const userModel = dmmf.modelMap.User;
    console.log('User model fields:', userModel.fields.map((f: any) => f.name));
    
    const classModel = dmmf.modelMap.Class;
    console.log('Class model fields:', classModel.fields.map((f: any) => f.name));

    const fiaaModel = dmmf.modelMap.FIAA;
    console.log('FIAA model fields:', fiaaModel.fields.map((f: any) => f.name));

  } catch (e) {
    console.log('Error checking fields:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
