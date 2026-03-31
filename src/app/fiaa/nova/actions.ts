"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { FiaaStatus } from "@prisma/client";

export async function createFiaaAction(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DOCENTE") {
    throw new Error("Unauthorized");
  }

  const studentId = formData.get("studentId") as string;
  const isDraft = formData.get("isDraft") === "true";

  // Difficulties
  const diffWorkExecution = formData.get("diffWorkExecution") === "on";
  const diffWorkQuality = formData.get("diffWorkQuality") === "on";
  const diffPPEUse = formData.get("diffPPEUse") === "on";
  const diffWorkPace = formData.get("diffWorkPace") === "on";
  const diffSafetyRules = formData.get("diffSafetyRules") === "on";
  const diffPersonalHygiene = formData.get("diffPersonalHygiene") === "on";
  const diffDisciplinaryConduct = formData.get("diffDisciplinaryConduct") === "on";
  
  // Teacher Actions
  const actAdviseAttendance = formData.get("actAdviseAttendance") === "on";
  const actAdviseStudy = formData.get("actAdviseStudy") === "on";
  const actAdviseTutoring = formData.get("actAdviseTutoring") === "on";

  // Save to DB
  await prisma.fIAA.create({
    data: {
      studentId,
      teacherId: session.user.id,
      status: isDraft ? FiaaStatus.DRAFT : FiaaStatus.PENDING_OPP,
      diffWorkExecution,
      diffWorkQuality,
      diffPPEUse,
      diffWorkPace,
      diffSafetyRules,
      diffPersonalHygiene,
      diffDisciplinaryConduct,
      actAdviseAttendance,
      actAdviseStudy,
      actAdviseTutoring,
      // Simplified for MVP length. Other fields can be mapped similarly.
    },
  });

  redirect("/dashboard/docente");
}
