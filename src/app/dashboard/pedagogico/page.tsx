import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import StatusKanban from "@/components/ui/StatusKanban";
import { Layers } from "lucide-react";
import Link from "next/link";

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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white font-bold cursor-default select-none shadow-sm">S</div>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Acompanhamento Pedagógico</h1>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/management" className="text-sm font-semibold text-gray-600 hover:text-red-600 flex items-center gap-1 transition-colors">
              <Layers size={16}/> Gestão
            </Link>
            <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
               <div className="text-right hidden sm:block">
                 <div className="text-sm font-semibold text-gray-900 leading-none">{session.user.name || "Usuário"}</div>
                 <div className="text-xs text-red-600 font-medium">{session.user.role}</div>
               </div>
               <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border border-gray-200 shadow-inner overflow-hidden">
                 {session.user.name?.charAt(0) || "U"}
               </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden flex flex-col">
        <div className="mb-6 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Fila de Atendimento</h2>
          <p className="text-gray-500 mt-1">Gerencie e analise as FIAAs enviadas pelos docentes</p>
        </div>

        <div className="flex-1 overflow-hidden min-h-[500px]">
          <StatusKanban items={formattedFIAAs} />
        </div>
      </main>
    </div>
  );
}
