import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Users, BookOpen, Plus } from "lucide-react";

export default async function ManagementPage() {
  const session = await getServerSession(authOptions);

  if (!session || !["OPP", "AQV_OE"].includes(session.user.role)) {
    redirect("/login");
  }

  const classes = await prisma.class.findMany({
    include: { _count: { select: { students: true } } },
    orderBy: { name: 'asc' }
  });

  const students = await prisma.student.findMany({
    include: { class: true },
    orderBy: { name: 'asc' },
    take: 50 // Limit for MVP
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">Painel de Gestão (AQV/OPP)</h1>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Turmas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <BookOpen className="text-red-500" size={20}/> Turmas Ativas
            </h2>
            <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium transition-colors">
              <Plus size={16}/> Nova
            </button>
          </div>
          <ul className="space-y-3">
             {classes.map((c: any) => (
               <li key={c.id} className="flex justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <span className="font-semibold text-gray-800">{c.name}</span>
                  <span className="text-sm text-gray-500">{c._count.students} alunos</span>
               </li>
             ))}
          </ul>
        </div>

        {/* Alunos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <Users className="text-red-500" size={20}/> Alunos (Top 50)
            </h2>
            <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium transition-colors">
              <Plus size={16}/> Novo
            </button>
          </div>
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="p-3 font-semibold text-gray-700">Nome</th>
                    <th className="p-3 font-semibold text-gray-700">Turma</th>
                  </tr>
               </thead>
               <tbody>
                 {students.map((s: any) => (
                   <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                     <td className="p-3 font-medium text-gray-800">{s.name}</td>
                     <td className="p-3 text-gray-500">
                       <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs">{s.class.name}</span>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
