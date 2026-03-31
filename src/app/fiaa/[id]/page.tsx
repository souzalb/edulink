import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import { ArrowLeft, User, BookOpen, Clock, Frown, Lightbulb, UserCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FiaaWorkflowButtons } from "./FiaaWorkflowButtons";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "DRAFT": return <Badge variant="secondary">Rascunho</Badge>;
    case "PENDING_OPP": return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Aguardando Orientação</Badge>;
    case "PENDING_TEACHER": return <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">Retornado ao Docente</Badge>;
    case "CONCLUDED": return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Concluído</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

export default async function FiaaDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const fiaa = await prisma.fIAA.findUnique({
    where: { id: resolvedParams.id },
    include: {
      student: { include: { class: true } },
      teacher: true,
    }
  });

  if (!fiaa) {
    return (
      <div className="min-h-screen bg-muted/40 pb-12">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
           <div className="bg-white p-8 rounded-xl text-center shadow-sm">
             <h2 className="text-xl font-bold text-gray-800">Ficha não encontrada</h2>
             <Link href="/"><button className="mt-4 px-4 py-2 border rounded-md">Retornar</button></Link>
           </div>
        </main>
      </div>
    );
  }

  const role = session.user.role;
  const isDocente = role === "DOCENTE";
  const backParams = isDocente ? "/dashboard/docente" : "/dashboard/pedagogico";

  // Re-map checked fields for UX display
  const difficultiesChecked = [
    { key: 'diffWorkExecution', label: "Execução do trabalho" },
    { key: 'diffWorkQuality', label: "Qualidade do Trabalho" },
    { key: 'diffPPEUse', label: "Uso do EPI ou EPC" },
    { key: 'diffWorkPace', label: "Ritmo de trabalho" },
    { key: 'diffSafetyRules', label: "Atendimento às regras de segurança" },
    { key: 'diffPersonalHygiene', label: "Higiene Pessoal" },
    { key: 'diffDisciplinaryConduct', label: "Conduta Disciplinar" }
  ].filter(d => (fiaa as any)[d.key]);

  const actionsChecked = [
    { key: 'actAdviseAttendance', label: "Frequentar regularmente as aulas" },
    { key: 'actAdviseStudy', label: "Estudar os conteúdos desenvolvidos" },
    { key: 'actAdviseTutoring', label: "Procurar Plantão de Dúvidas" }
  ].filter(a => (fiaa as any)[a.key]);

  return (
    <div className="min-h-screen bg-muted/40 pb-12">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href={backParams} className="text-muted-foreground hover:text-foreground flex items-center gap-2 font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-border">
            <ArrowLeft size={18} /> Voltar ao Painel
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">Status Atual:</span>
            {getStatusBadge(fiaa.status)}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          
          {/* Header Info */}
          <div className="p-6 md:p-8 bg-muted/20 border-b border-border grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div>
               <div className="text-sm text-muted-foreground mb-1 font-semibold flex items-center gap-2">
                 <User size={16}/> Aluno Requerente
               </div>
               <div className="text-xl font-bold text-foreground">{fiaa.student.name}</div>
               <div className="text-sm text-primary font-medium mt-1 inline-block bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                 Turma: {fiaa.student.class.name}
               </div>
             </div>

             <div className="space-y-4">
               <div>
                 <div className="text-sm text-muted-foreground mb-1 font-semibold flex items-center gap-2">
                   <UserCheck size={16}/> Professor Relator
                 </div>
                 <div className="text-lg font-medium text-foreground">{fiaa.teacher.name}</div>
               </div>
               <div>
                  <div className="text-sm text-muted-foreground mb-1 font-semibold flex items-center gap-2">
                   <Clock size={16}/> Data do Envio
                 </div>
                 <div className="text-base font-medium text-foreground">
                   {format(new Date(fiaa.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                 </div>
               </div>
             </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <section>
               <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 border-b pb-2">
                 <Frown className="text-red-500" size={20}/> 
                 Dificuldades Observadas
               </h3>
               {difficultiesChecked.length > 0 ? (
                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {difficultiesChecked.map(d => (
                     <li key={d.key} className="flex items-start gap-2 text-sm text-gray-700 bg-red-50/50 p-2.5 rounded-md border border-red-100">
                       <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                       <span className="font-medium text-red-900">{d.label}</span>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-sm text-muted-foreground">Nenhuma dificuldade específica marcada.</p>
               )}
            </section>

            <section>
               <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 border-b pb-2">
                 <Lightbulb className="text-emerald-500" size={20}/> 
                 Ações Tomadas pelo Docente
               </h3>
               {actionsChecked.length > 0 ? (
                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {actionsChecked.map(a => (
                     <li key={a.key} className="flex items-start gap-2 text-sm text-gray-700 bg-emerald-50/50 p-2.5 rounded-md border border-emerald-100">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                       <span className="font-medium text-emerald-900">{a.label}</span>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-sm text-muted-foreground">Nenhuma sugestão ou ação secundária foi descrita.</p>
               )}
            </section>

            {/* Apenas usuários da área pedagógica podem gerenciar o workflow ativamente deste ponto para a frente */}
            {!isDocente && (
               <FiaaWorkflowButtons fiaaId={fiaa.id} currentStatus={fiaa.status} />
            )}
            
          </div>

        </div>
      </main>
    </div>
  );
}
