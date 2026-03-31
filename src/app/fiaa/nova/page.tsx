import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Accordion from "@/components/ui/Accordion";
import { createFiaaAction } from "./actions";
import { ArrowLeft, Save, Send } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NovaFiaaPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DOCENTE") {
    redirect("/login");
  }

  // Fetch classes and students for the select box
  const students = await prisma.student.findMany({
    include: { class: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard/docente" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 font-medium">
            <ArrowLeft size={18} /> Voltar
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Nova FIAA</h1>
          <div className="w-20"></div> {/* Spacer for center alignment */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ficha de Acompanhamento de Aluno</h2>
          <p className="text-gray-500 mb-8 pb-6 border-b border-gray-100">
            Destaque as dificuldades encontradas e as ações tomadas pelo docente.
          </p>

          <form action={createFiaaAction} className="space-y-6">
            
            <div className="space-y-2 max-w-md mb-8">
              <label className="text-sm font-semibold text-gray-700 block">Aluno *</label>
              <select 
                name="studentId" 
                required
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value="">Selecione o aluno...</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.class.name})
                  </option>
                ))}
              </select>
            </div>

            <Accordion title="1. Dificuldades Observadas" defaultOpen={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-red-50 group">
                  <input type="checkbox" name="diffWorkExecution" className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                  <span className="text-gray-700 group-hover:text-red-900">Execução do trabalho</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-red-50 group">
                  <input type="checkbox" name="diffWorkQuality" className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                  <span className="text-gray-700 group-hover:text-red-900">Qualidade do Trabalho</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-red-50 group">
                  <input type="checkbox" name="diffPPEUse" className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                  <span className="text-gray-700 group-hover:text-red-900">Uso do EPI ou EPC</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-red-50 group">
                  <input type="checkbox" name="diffWorkPace" className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                  <span className="text-gray-700 group-hover:text-red-900">Ritmo de trabalho</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-red-50 group">
                  <input type="checkbox" name="diffSafetyRules" className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                  <span className="text-gray-700 group-hover:text-red-900">Atendimento às regras de segurança</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-red-50 group">
                  <input type="checkbox" name="diffPersonalHygiene" className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                  <span className="text-gray-700 group-hover:text-red-900">Higiene Pessoal</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-red-50 group">
                  <input type="checkbox" name="diffDisciplinaryConduct" className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                  <span className="text-gray-700 group-hover:text-red-900">Conduta Disciplinar</span>
                </label>
              </div>
            </Accordion>

            <Accordion title="2. Sugestões / Ações Tomadas pelo Docente">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-red-50 group">
                  <input type="checkbox" name="actAdviseAttendance" className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                  <span className="text-gray-700 group-hover:text-red-900">Frequentar regularmente as aulas</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-red-50 group">
                  <input type="checkbox" name="actAdviseStudy" className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                  <span className="text-gray-700 group-hover:text-red-900">Estudar os conteúdos desenvolvidos</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-red-50 group">
                  <input type="checkbox" name="actAdviseTutoring" className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                  <span className="text-gray-700 group-hover:text-red-900">Procurar Plantão de Dúvidas</span>
                </label>
              </div>
            </Accordion>

            <div className="flex gap-4 justify-end pt-8 mt-8 border-t border-gray-100">
              <button
                type="submit"
                name="isDraft"
                value="true"
                className="px-6 py-3 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <Save size={18} /> Salvar Rascunho
              </button>
              
              <button
                type="submit"
                name="isDraft"
                value="false"
                className="px-6 py-3 rounded-lg bg-red-600 font-medium text-white hover:bg-red-700 flex items-center gap-2 transition-colors"
                title="A Ficha vai diretamente para o Painel do Orientador"
              >
                <Send size={18} /> Enviar p/ Orientação
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}
