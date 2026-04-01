import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FilePlus2 } from "lucide-react";
import Header from "@/components/layout/Header";
import { FiaaDataTable } from "@/components/ui/FiaaDataTable";

export default async function DocenteDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DOCENTE") {
    return null;
  }

  // Find FIAAs created by this teacher
  const fias = await prisma.fIAA.findMany({
    where: { teacherId: session.user.id },
    include: { 
      student: { include: { class: true } },
      teacher: true
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedFIAAs = fias.map((f) => ({
    id: f.id,
    studentName: f.student.name,
    className: f.student.class.name,
    teacherName: f.teacher.name,
    createdAt: f.createdAt,
    status: f.status,
  }));

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      <Header />

      <main className="flex-1 w-full mx-auto px-4 sm:px-8 lg:px-10 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-outfit">Suas FIAAs</h2>
            <p className="text-gray-500 mt-1 font-inter">Gerencie e acompanhe seus registros pedagógicos</p>
          </div>
          <Link
            href="/fiaa/nova"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors font-inter"
          >
            <FilePlus2 size={20} />
            <span className="hidden sm:inline">Nova FIAA</span>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <FiaaDataTable items={formattedFIAAs} />
        </div>
      </main>
    </div>
  );
}
