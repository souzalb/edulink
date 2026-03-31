"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createClassAction(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) throw new Error("Name is required");

  await prisma.class.create({ data: { name } });
  revalidatePath("/management");
  revalidatePath("/fiaa/nova");
}

export async function createStudentAction(formData: FormData) {
  const name = formData.get("name") as string;
  const classId = formData.get("classId") as string;
  if (!name || !classId) throw new Error("Name and class are required");

  await prisma.student.create({ data: { name, classId } });
  revalidatePath("/management");
}

export async function linkTeacherAction(formData: FormData) {
  const classId = formData.get("classId") as string;
  const teacherId = formData.get("teacherId") as string;
  if (!classId || !teacherId) throw new Error("Missing parameters");

  await prisma.class.update({
    where: { id: classId },
    data: { teachers: { connect: { id: teacherId } } }
  });
  revalidatePath("/management");
  revalidatePath("/management");
  revalidatePath("/fiaa/nova");
}

export async function createTeacherAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  
  if (!name || !email) throw new Error("Name and email are required");

  const bcrypt = await import("bcryptjs");
  const defaultPasswordHash = await bcrypt.hash("123456", 10);

  await prisma.user.create({
    data: { 
      name, 
      email, 
      password: defaultPasswordHash,
      role: "DOCENTE"
    } 
  });
  
  revalidatePath("/management");
}
