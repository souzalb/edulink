"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function updateFiaaStatus(fiaaId: string, newStatus: any) {
  const session = await getServerSession(authOptions);
  
  if (!session || !["OPP", "AQV_OE"].includes(session.user.role as string)) {
    throw new Error("Unauthorized");
  }

  await prisma.fIAA.update({
    where: { id: fiaaId },
    data: { status: newStatus },
  });

  revalidatePath(`/fiaa/${fiaaId}`);
  revalidatePath("/dashboard/pedagogico");
  revalidatePath("/dashboard/docente");
}
