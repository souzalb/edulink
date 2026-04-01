import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import { ArrowLeft, User, Clock, Frown, Lightbulb, UserCheck, ShieldCheck, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FiaaWorkflowButtons } from "./FiaaWorkflowButtons";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "DRAFT": 
      return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">Rascunho</Badge>;
    case "PENDING_OPP": 
      return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 font-semibold">Aguardando Orientação</Badge>;
    case "PENDING_TEACHER": 
      return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">Retornado ao Docente</Badge>;
    case "PENDING_GUARDIAN": 
      return <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">Aguardando Responsável</Badge>;
    case "CONCLUDED": 
      return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">Concluído</Badge>;
    default: 
      return <Badge variant="outline" className="font-medium px-2 py-0.5">{status}</Badge>;
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

  const renderActiveFields = (fields: { key: string, label: string }[], colorClass: string, categoryName: string) => {
    const active = fields.filter(f => (fiaa as any)[f.key] === true);
    
    if (active.length === 0) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-400 italic p-3 border border-dashed rounded-lg bg-gray-50/30">
          <AlertCircle size={14} />
          Nenhum apontamento em {categoryName}.
        </div>
      );
    }

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
    <div className="min-h-screen bg-muted/40 pb-12 font-inter">
      <Header />
      
      <main className="flex-1 w-full mx-auto px-4 sm:px-8 lg:px-10 mt-8 mb-12">
        <div className="mb-6 flex items-center justify-between">
          <Link href={backParams} className="text-muted-foreground hover:text-foreground flex items-center gap-2 font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-border">
            <ArrowLeft size={18} /> Voltar ao Painel
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          
          {/* Header Info */}
          <div className="p-6 md:p-8 bg-muted/20 border-b border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {/* Coluna 1: Aluno */}
             <div className="space-y-1">
               <div className="text-[10px] text-muted-foreground font-bold flex items-center gap-2 uppercase tracking-widest">
                 <User size={14} className="text-primary/60"/> Aluno Requerente
               </div>
               <div className="text-xl font-outfit font-bold text-gray-900">{fiaa.student.name}</div>
               <div className="text-xs text-primary font-semibold mt-1 inline-flex items-center bg-primary/5 px-2.5 py-0.5 rounded-full border border-primary/20 shadow-sm">
                 Turma: {fiaa.student.class.name}
               </div>
             </div>

             {/* Coluna 2: Professor */}
             <div className="space-y-1">
               <div className="text-[10px] text-muted-foreground font-bold flex items-center gap-2 uppercase tracking-widest">
                 <UserCheck size={14} className="text-primary/60"/> Professor Relator
               </div>
               <div className="text-lg font-semibold text-gray-800">{fiaa.teacher.name}</div>
               <div className="text-xs text-muted-foreground italic">Responsável pelo envio</div>
             </div>

             {/* Coluna 3: Data */}
             <div className="space-y-1">
               <div className="text-[10px] text-muted-foreground font-bold flex items-center gap-2 uppercase tracking-widest">
                 <Clock size={14} className="text-primary/60"/> Data do Envio
               </div>
               <div className="text-lg font-semibold text-gray-800">
                 {format(new Date(fiaa.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
               </div>
               <div className="text-xs text-muted-foreground italic">Horário: {format(new Date(fiaa.createdAt), "HH:mm")}</div>
             </div>

             {/* Coluna 4: Status */}
             <div className="space-y-2">
               <div className="text-[10px] text-muted-foreground font-bold flex items-center gap-2 uppercase tracking-widest">
                 <CheckCircle size={14} className="text-primary/60"/> Status da Ficha
               </div>
               <div className="pt-1">
                 {getStatusBadge(fiaa.status)}
               </div>
               <p className="text-[10px] text-muted-foreground italic leading-tight">
                 Fase atual do fluxo de atendimento pedagógico
               </p>
             </div>
          </div>

          <div className="p-6 md:p-8 space-y-10">
            
            {/* DIFICULDADES */}
            <section className="space-y-6">
               <h3 className="text-lg font-outfit font-bold text-foreground flex items-center gap-2 border-b pb-2">
                 <Frown className="text-red-500" size={20}/> 
                 Dificuldades Observadas
               </h3>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                 <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 flex flex-col">
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">1. Execução do Trabalho</h4>
                   <div className="flex-1">
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
                     ], "bg-red-50 text-red-700 border-red-200", "Execução do Trabalho")}
                   </div>
                 </div>

                 <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 flex flex-col">
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">2. Higiene e Segurança</h4>
                   <div className="flex-1">
                     {renderActiveFields([
                       { key: 'diffPPEUse', label: "Uso do EPI ou EPC" },
                       { key: 'diffSafetyRules', label: "Atendimento a normas de segurança" },
                       { key: 'diffEnvironmentalCare', label: "Cuidados ambientes (org./limp.)" },
                       { key: 'diffPropertyCare', label: "Cuidados com bens da escola" },
                       { key: 'diffPersonalHygiene', label: "Higiene Pessoal" },
                       { key: 'diffUniformUse', label: "Uso do uniforme" },
                     ], "bg-orange-50 text-orange-700 border-orange-200", "Higiene e Segurança")}
                   </div>
                 </div>

                 <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 flex flex-col">
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">3. Qualidades Pessoais</h4>
                   <div className="flex-1">
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
                     ], "bg-blue-50 text-blue-700 border-blue-200", "Qualidades Pessoais")}
                   </div>
                 </div>
               </div>

               {fiaa.diffOther && (
                 <div className="p-5 bg-amber-50/30 rounded-xl border border-amber-100/50 shadow-sm mt-4">
                   <h4 className="text-[10px] font-bold text-amber-700 uppercase mb-2 tracking-widest flex items-center gap-1.5">
                     <AlertCircle size={14} /> Outras Dificuldades Reportadas
                   </h4>
                   <p className="text-sm text-gray-700 italic leading-relaxed">{fiaa.diffOther}</p>
                 </div>
               )}
            </section>

            {/* AÇÕES DOCENTE */}
            <section className="space-y-6">
               <h3 className="text-lg font-outfit font-bold text-foreground flex items-center gap-2 border-b pb-2">
                 <Lightbulb className="text-emerald-500" size={20}/> 
                 Ações do Docente
               </h3>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-emerald-50/20 p-5 rounded-xl border border-emerald-100/50">
                   <h4 className="text-xs font-bold text-emerald-800/60 uppercase tracking-widest mb-3">1. Sugestões para o Aluno</h4>
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
                   ], "bg-white/60 text-emerald-800 border-emerald-200/50", "Sugestões para o Aluno")}
                 </div>

                 <div className="bg-teal-50/20 p-5 rounded-xl border border-teal-100/50">
                   <h4 className="text-xs font-bold text-teal-800/60 uppercase tracking-widest mb-3">2. Sugestões para Responsáveis</h4>
                   {renderActiveFields([
                     { key: 'guardAdviseStudyHabits', label: "Estimular hábitos de estudo" },
                     { key: 'guardAdviseSchedule', label: "Conciliar estudo e lazer" },
                     { key: 'guardAdviseMonitor', label: "Acompanhar desempenho escolar" },
                     { key: 'guardAdviseContactSchool', label: "Manter contato com a escola" },
                     { key: 'guardAdviseAttendance', label: "Atentar para frequência regular" },
                   ], "bg-white/60 text-teal-800 border-teal-200/50", "Sugestões para Responsáveis")}
                 </div>
               </div>
            </section>

            {/* ENCAMINHAMENTO ORIGINAL */}
            <section className="space-y-6 pt-6 border-t border-dashed">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 mb-3 tracking-widest font-outfit">
                      <ShieldCheck size={16} className="text-gray-400"/> Destino do Encaminhamento
                    </h3>
                    <Badge variant="outline" className="text-base py-1.5 px-5 border-primary/30 text-primary bg-primary/5 rounded-lg shadow-sm">
                      {fiaa.referral || "Não especificado"}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 mb-3 tracking-widest font-outfit">
                      <MessageSquare size={16} className="text-gray-400"/> Observações do Docente
                    </h3>
                    <div className="text-sm text-gray-700 bg-gray-50/80 p-5 rounded-xl border border-gray-200 whitespace-pre-wrap leading-relaxed shadow-inner font-inter italic">
                      {fiaa.provObservations || "Nenhuma observação complementar registrada."}
                    </div>
                  </div>
               </div>
            </section>

            {/* FEEDBACK DA GESTÃO */}
            {/* @ts-ignore */}
            {(fiaa.feedbackPedagogico || fiaa.acoesPedagogico) && (
              <section className="space-y-6 pt-10 border-t-2 border-primary/10 bg-primary/5 -mx-6 px-6 pb-10 rounded-b-xl mt-4">
                 <h3 className="text-lg font-outfit font-bold text-primary flex items-center gap-2 border-b border-primary/20 pb-3">
                   <CheckCircle className="text-primary" size={22}/> 
                   Retorno da Gestão Pedagógica
                 </h3>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    {/* @ts-ignore */}
                    {fiaa.feedbackPedagogico && (
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                           Feedback ao Professor
                        </label>
                        <div className="bg-white p-5 rounded-xl border border-primary/20 text-sm shadow-md leading-relaxed text-gray-800 font-inter">
                          {/* @ts-ignore */}
                          {fiaa.feedbackPedagogico}
                        </div>
                      </div>
                    )}
                    {/* @ts-ignore */}
                    {fiaa.acoesPedagogico && (
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                           Ações Tomadas
                        </label>
                        <div className="bg-white p-5 rounded-xl border border-primary/20 text-sm shadow-md leading-relaxed text-gray-800 font-inter">
                          {/* @ts-ignore */}
                          {fiaa.acoesPedagogico}
                        </div>
                      </div>
                    )}
                 </div>
              </section>
            )}

            {/* WORKFLOW (OPP/AQV) */}
             {!isDocente && (
               <div className="pt-8 border-t border-gray-200">
                 <FiaaWorkflowButtons 
                   fiaaId={fiaa.id} 
                   currentStatus={fiaa.status} 
                   userRole={session.user.role} 
                   currentReferral={fiaa.referral || ""}
                 />
               </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}
