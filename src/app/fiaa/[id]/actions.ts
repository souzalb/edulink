"use server";

import prisma from "@/lib/prisma";
import { FiaaStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateFiaaStatus(
  fiaaId: string, 
  newStatus: FiaaStatus,
  feedback?: string,
  acoes?: string,
  newReferral?: any
) {
  const session = await getServerSession(authOptions);
  
  if (!session || !["OPP", "AQV_OE"].includes(session.user.role as string)) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.fIAA.update({
      where: { id: fiaaId },
      data: { 
        status: newStatus,
        referral: newReferral || undefined,
        feedbackPedagogico: feedback,
        acoesPedagogico: acoes
      },
    });

    revalidatePath(`/fiaa/${fiaaId}`);
    revalidatePath("/dashboard/pedagogico");
    revalidatePath("/dashboard/docente");
  } catch (error) {
    console.error("Failed to update FIAA status:", error);
    throw new Error("Erro ao atualizar o status da FIAA no banco de dados.");
  }
}
