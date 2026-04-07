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
    <div className="min-h-screen bg-background flex flex-col transition-colors">
      <Header />

      <main className="flex-1 w-full mx-auto px-4 sm:px-8 lg:px-10 py-8 overflow-hidden flex flex-col">

        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">Gestão do Sistema</h2>
            <p className="text-muted-foreground mt-1 font-medium italic">Administre turmas, alunos e o corpo docente da unidade.</p>
          </div>
          <Link href="/dashboard/pedagogico" className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center gap-2 bg-card px-5 py-2.5 rounded-xl shadow-sm border border-border transition-all hover:shadow-md cursor-pointer group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Voltar ao Painel
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
