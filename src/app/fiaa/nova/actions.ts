"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FiaaStatus, ReferralType } from "@prisma/client";

export async function createFiaaAction(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DOCENTE") {
    throw new Error("Unauthorized");
  }

  const studentId = formData.get("studentId") as string;
  if (!studentId || studentId.trim() === "") {
    throw new Error("Você precisa selecionar um aluno para enviar a ficha.");
  }
  const isDraft = formData.get("isDraft") === "true";

  const getBool = (name: string) => formData.get(name) === "on";

  // Data mapping
  const data: any = {
    studentId,
    teacherId: session.user.id,
    status: isDraft ? FiaaStatus.DRAFT : FiaaStatus.PENDING_OPP,
    
    // 1. Execução do Trabalho
    diffWorkExecution: getBool("diffWorkExecution"),
    diffWorkQuality: getBool("diffWorkQuality"),
    diffWorkPace: getBool("diffWorkPace"),
    diffEquipmentHandling: getBool("diffEquipmentHandling"),
    diffInitiative: getBool("diffInitiative"),
    diffParticipation: getBool("diffParticipation"),
    diffTargetAchievement: getBool("diffTargetAchievement"),
    diffCommitment: getBool("diffCommitment"),
    diffResultFocus: getBool("diffResultFocus"),
    diffNotDoingTasks: getBool("diffNotDoingTasks"),

    // 2. Higiene e Segurança
    diffPPEUse: getBool("diffPPEUse"),
    diffSafetyRules: getBool("diffSafetyRules"),
    diffEnvironmentalCare: getBool("diffEnvironmentalCare"),
    diffPropertyCare: getBool("diffPropertyCare"),
    diffPersonalHygiene: getBool("diffPersonalHygiene"),
    diffUniformUse: getBool("diffUniformUse"),

    // 3. Qualidades Pessoais
    diffCommunication: getBool("diffCommunication"),
    diffAbilityToListen: getBool("diffAbilityToListen"),
    diffSociability: getBool("diffSociability"),
    diffMotivation: getBool("diffMotivation"),
    diffDisciplinaryConduct: getBool("diffDisciplinaryConduct"),
    diffCooperation: getBool("diffCooperation"),
    diffAttendance: getBool("diffAttendance"),
    diffKnowledge: getBool("diffKnowledge"),
    diffProfessionalEthics: getBool("diffProfessionalEthics"),

    diffOther: formData.get("diffOther") as string,

    // Sugestões Aluno
    actAdviseAttendance: getBool("actAdviseAttendance"),
    actAdviseStudy: getBool("actAdviseStudy"),
    actAdviseSchedule: getBool("actAdviseSchedule"),
    actAdviseNotes: getBool("actAdviseNotes"),
    actAdviseFocus: getBool("actAdviseFocus"),
    actAdviseSocialRules: getBool("actAdviseSocialRules"),
    actAdviseTasks: getBool("actAdviseTasks"),
    actAdviseParticipation: getBool("actAdviseParticipation"),
    actAdviseRetest: getBool("actAdviseRetest"),
    actAdviseTutoring: getBool("actAdviseTutoring"),
    actAdviseMakeUpClasses: getBool("actAdviseMakeUpClasses"),

    // Sugestões Responsáveis
    guardAdviseStudyHabits: getBool("guardAdviseStudyHabits"),
    guardAdviseSchedule: getBool("guardAdviseSchedule"),
    guardAdviseMonitor: getBool("guardAdviseMonitor"),
    guardAdviseContactSchool: getBool("guardAdviseContactSchool"),
    guardAdviseAttendance: getBool("guardAdviseAttendance"),

    // Encaminhamento e Obs
    referral: formData.get("referral") as ReferralType,
    provObservations: formData.get("provObservations") as string,
  };

  // Save to DB
  await prisma.fIAA.create({ data });

  redirect("/dashboard/docente");
}
