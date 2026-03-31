import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FilePlus2, FileText, CheckCircle2 } from "lucide-react";
import Header from "@/components/layout/Header";

export default async function DocenteDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DOCENTE") {
    return null;
  }

  // Find FIAAs created by this teacher
  const fias = await prisma.fIAA.findMany({
    where: { teacherId: session.user.id },
    include: { student: { include: { class: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Suas FIAAs</h2>
            <p className="text-gray-500 mt-1">Gerencie os acompanhamentos pedagógicos</p>
          </div>
          <Link
            href="/fiaa/nova"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <FilePlus2 size={20} />
            <span className="hidden sm:inline">Nova FIAA</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fias.length === 0 ? (
             <div className="col-span-full bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma FIAA emitida</h3>
                <p className="text-gray-500">Você ainda não gerou nenhuma ficha de acompanhamento.</p>
             </div>
          ) : (
            fias.map((fiaa) => (
              <Link href={`/fiaa/${fiaa.id}`} key={fiaa.id}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-red-300 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold px-2 py-1 bg-red-50 text-red-700 rounded-md">
                      {fiaa.student.class.name}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full flex gap-1 items-center">
                      <CheckCircle2 size={12}/>
                      {fiaa.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-red-600 transition-colors">
                    {fiaa.student.name}
                  </h3>
                  <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                    <FileText size={16} /> Aberta em {fiaa.createdAt.toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
