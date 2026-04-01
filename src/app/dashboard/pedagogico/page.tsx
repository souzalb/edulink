import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FiaaDataTable } from "@/components/ui/FiaaDataTable";
import { Layers } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { Settings } from "lucide-react";

export default async function PedagogicoDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !["OPP", "AQV_OE"].includes(session.user.role)) {
    return null;
  }

  // Role-based visibility filtering
  const userRole = session.user.role;
  const referralFilter = userRole === "AQV_OE" 
    ? ["AQV", "OE"] 
    : ["OPP", "COORD", "CT", "CAP"];

  // Fetch FIAAs for the queue based on the user's role
  const fiasData = await prisma.fIAA.findMany({
    where: {
      status: { 
        notIn: ["DRAFT", "CONCLUDED", "ARCHIVED"] as any 
      },
      referral: { in: referralFilter as any },
    },
    include: {
      student: { include: { class: true } },
      teacher: true,
    },
    orderBy: { createdAt: "asc" },
  }) as any; // Temporary cast to bypass complex Prisma inference issue in LSP

  const formattedFIAAs = fiasData.map((f: any) => ({
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

      <main className="flex-1 w-full mx-auto px-4 sm:px-8 lg:px-10 py-8 overflow-hidden flex flex-col">
        <div className="mb-6 flex-shrink-0 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Fila de Atendimento</h2>
            <p className="text-gray-500 mt-1">Gerencie e analise as FIAAs enviadas pelos docentes</p>
          </div>
          <Link 
            href="/management" 
            className="flex items-center gap-2 bg-white border border-border px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary hover:border-primary transition-all shadow-sm cursor-pointer"
          >
            <Settings size={18} />
            Configurações e Cadastros
          </Link>
        </div>

        <div className="flex-1 min-h-[500px]">
          <FiaaDataTable items={formattedFIAAs} />
        </div>
      </main>
    </div>
  );
}
