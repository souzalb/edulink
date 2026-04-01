import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { ManagementContent } from "./components/ManagementContent";

export default async function ManagementPage() {
  const session = await getServerSession(authOptions);

  if (!session || !["OPP", "AQV_OE"].includes(session.user.role)) {
    redirect("/login");
  }

  // Fetch all classes
  const classes = await prisma.class.findMany({
    include: {
      _count: { select: { students: true } },
      teachers: true
    },
    orderBy: { name: 'asc' }
  }) as any[];

  // Fetch all students
  const students = await prisma.student.findMany({
    include: { class: true },
    orderBy: { name: 'asc' },
    take: 100
  });

  // Fetch all teachers
  const teachers = await prisma.user.findMany({
    where: { role: "DOCENTE" },
    include: {
      classes: true
    },
    orderBy: { name: "asc" }
  }) as any[];

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      <Header />

      <main className="flex-1 w-full mx-auto px-4 sm:px-8 lg:px-10 py-8">

        <div className="mb-8 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-gray-900">Gestão do Sistema</h2>
            <p className="text-gray-500 mt-1">Administre turmas, alunos e o corpo docente da unidade.</p>
          </div>
          <Link href="/dashboard/pedagogico" className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-border transition-all hover:shadow-md">
            <ArrowLeft size={18} /> Voltar ao Painel
          </Link>
        </div>

        <ManagementContent
          initialClasses={classes}
          initialStudents={students}
          initialTeachers={teachers}
        />
      </main>
    </div>
  );
}
