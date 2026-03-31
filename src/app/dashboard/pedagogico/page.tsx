import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FiaaDataTable } from "@/components/ui/FiaaDataTable";
import { Layers } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";

export default async function PedagogicoDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !["OPP", "AQV_OE"].includes(session.user.role)) {
    return null;
  }

  // Fetch all FIAAs for the Kanban
  const fiasData = await prisma.fIAA.findMany({
    include: {
      student: { include: { class: true } },
      teacher: true,
    },
    orderBy: { createdAt: "asc" }, // Requested by prompt: Fila ordenada por data de criação
  });

  const formattedFIAAs = fiasData.map((f) => ({
    id: f.id,
    studentName: f.student.name,
    className: f.student.class.name,
    teacherName: f.teacher.name,
    createdAt: f.createdAt,
    status: f.status,
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden flex flex-col">
        <div className="mb-6 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Fila de Atendimento</h2>
          <p className="text-gray-500 mt-1">Gerencie e analise as FIAAs enviadas pelos docentes</p>
        </div>

        <div className="flex-1 min-h-[500px]">
          <FiaaDataTable items={formattedFIAAs} />
        </div>
      </main>
    </div>
  );
}
