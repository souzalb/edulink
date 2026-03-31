import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import { ArrowLeft, User, BookOpen, Clock, Frown, Lightbulb, UserCheck, ShieldCheck, UserCircle, MessageSquare } from "lucide-react";
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
    case "PENDING_GUARDIAN": return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">Aguardando Responsável</Badge>;
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

  const renderActiveFields = (fields: { key: string, label: string }[], colorClass: string) => {
    const active = fields.filter(f => (fiaa as any)[f.key] === true);
    if (active.length === 0) return null;

    return (
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
        {active.map(f => (
          <li key={f.key} className={`flex items-center gap-2 text-sm p-2 rounded border border-dotted ${colorClass}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
            <span>{f.label}</span>
          </li>
        ))}
      </ul>
    );
  };

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

          <div className="p-6 md:p-8 space-y-10">
            
            {/* DIFICULDADES */}
            <section className="space-y-6">
               <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b pb-2">
                 <Frown className="text-red-500" size={20}/> 
                 Dificuldades Observadas
               </h3>
               
               <div className="space-y-4">
                 <div>
                   <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">1. Execução do Trabalho</h4>
                   {renderActiveFields([
                     { key: 'diffWorkExecution', label: "Execução do trabalho" },
                     { key: 'diffWorkQuality', label: "Qualidade do Trabalho" },
                     { key: 'diffWorkPace', label: "Ritmo de trabalho" },
                     { key: 'diffEquipmentHandling', label: "Manuseio de máquinas/equipamentos" },
                     { key: 'diffInitiative', label: "Iniciativa" },
                     { key: 'diffParticipation', label: "Participação" },
                     { key: 'diffTargetAchievement', label: "Cumprimento de metas" },
                     { key: 'diffCommitment', label: "Comprometimento" },
                     { key: 'diffResultFocus', label: "Foco em resultado" },
                     { key: 'diffNotDoingTasks', label: "Não realização de atividades" },
                   ], "bg-red-50 text-red-700 border-red-200")}
                 </div>

                 <div>
                   <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">2. Higiene e Segurança</h4>
                   {renderActiveFields([
                     { key: 'diffPPEUse', label: "Uso do EPI ou EPC" },
                     { key: 'diffSafetyRules', label: "Atendimento a normas de segurança" },
                     { key: 'diffEnvironmentalCare', label: "Cuidados ambientes (org./limp.)" },
                     { key: 'diffPropertyCare', label: "Cuidados com bens da escola" },
                     { key: 'diffPersonalHygiene', label: "Higiene Pessoal" },
                     { key: 'diffUniformUse', label: "Uso do uniforme" },
                   ], "bg-orange-50 text-orange-700 border-orange-200")}
                 </div>

                 <div>
                   <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">3. Qualidades Pessoais</h4>
                   {renderActiveFields([
                     { key: 'diffCommunication', label: "Saber se comunicar" },
                     { key: 'diffAbilityToListen', label: "Habilidade para ouvir" },
                     { key: 'diffSociability', label: "Sociabilidade" },
                     { key: 'diffMotivation', label: "Motivação / interesse" },
                     { key: 'diffDisciplinaryConduct', label: "Conduta disciplinar" },
                     { key: 'diffCooperation', label: "Cooperação" },
                     { key: 'diffAttendance', label: "Assiduidade (atrasos/falta)" },
                     { key: 'diffKnowledge', label: "Conhecimento" },
                     { key: 'diffProfessionalEthics', label: "Ética profissional" },
                   ], "bg-blue-50 text-blue-700 border-blue-200")}
                 </div>

                 {fiaa.diffOther && (
                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                     <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Outras Dificuldades</h4>
                     <p className="text-sm text-gray-700 italic">{fiaa.diffOther}</p>
                   </div>
                 )}
               </div>
            </section>

            {/* AÇÕES */}
            <section className="space-y-6">
               <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b pb-2">
                 <Lightbulb className="text-emerald-500" size={20}/> 
                 Ações do Docente
               </h3>

               <div className="space-y-4">
                 <div>
                   <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">1. Sugestões para o Aluno</h4>
                   {renderActiveFields([
                     { key: 'actAdviseAttendance', label: "Frequentar regularmente as aulas" },
                     { key: 'actAdviseStudy', label: "Estudar os conteúdos" },
                     { key: 'actAdviseSchedule', label: "Organizar horário para estudo" },
                     { key: 'actAdviseNotes', label: "Fazer anotações" },
                     { key: 'actAdviseFocus', label: "Manter-se atento" },
                     { key: 'actAdviseSocialRules', label: "Regras de convivência social" },
                     { key: 'actAdviseTasks', label: "Realizar as tarefas propostas" },
                     { key: 'actAdviseParticipation', label: "Participar efetivamente" },
                     { key: 'actAdviseRetest', label: "Refazer avaliações/exercícios" },
                     { key: 'actAdviseTutoring', label: "Procurar Plantão de Dúvida" },
                     { key: 'actAdviseMakeUpClasses', label: "Realizar reposição/recuperação" },
                   ], "bg-emerald-50 text-emerald-700 border-emerald-200")}
                 </div>

                 <div>
                   <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">2. Sugestões para Responsáveis</h4>
                   {renderActiveFields([
                     { key: 'guardAdviseStudyHabits', label: "Estimular hábitos de estudo" },
                     { key: 'guardAdviseSchedule', label: "Conciliar estudo e lazer" },
                     { key: 'guardAdviseMonitor', label: "Acompanhar desempenho escolar" },
                     { key: 'guardAdviseContactSchool', label: "Manter contato com a escola" },
                     { key: 'guardAdviseAttendance', label: "Atentar para frequência regular" },
                   ], "bg-teal-50 text-teal-700 border-teal-200")}
                 </div>
               </div>
            </section>

            {/* ENCAMINHAMENTO */}
            <section className="space-y-6 pt-4 border-t">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2 mb-3">
                      <ShieldCheck size={16}/> Destino do Encaminhamento
                    </h3>
                    <Badge variant="outline" className="text-base py-1 px-4 border-primary/30 text-primary bg-primary/5">
                      {fiaa.referral}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2 mb-3">
                      <MessageSquare size={16}/> Informações Complementares
                    </h3>
                    <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap">
                      {fiaa.provObservations || "Nenhuma observação complementar registrada."}
                    </div>
                  </div>
               </div>
            </section>

            {/* WORKFLOW */}
            {!isDocente && (
               <div className="pt-6 border-t">
                 <FiaaWorkflowButtons fiaaId={fiaa.id} currentStatus={fiaa.status} />
               </div>
            )}
            
          </div>

        </div>
      </main>
    </div>
  );
}
