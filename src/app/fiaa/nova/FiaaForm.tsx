"use client";

import { useState } from "react";
import { createFiaaAction } from "./actions";
import Accordion from "@/components/ui/Accordion";
import { Save, Send, ClipboardList, ShieldCheck, UserCheck, GraduationCap, Users as UsersIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Student = { id: string; name: string };
type ClassType = { id: string; name: string; students: Student[] };

export function FiaaForm({ classes }: { classes: ClassType[] }) {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [referral, setReferral] = useState<string>("OPP");

  const referralOptions = [
    { value: "OPP", label: "OPP (Orientação Pedagógica)" },
    { value: "AQV", label: "AQV (Qualidade de Vida)" },
    { value: "COORD", label: "Coordenador" },
  ];

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const students = selectedClass?.students || [];

  return (
    <form action={createFiaaAction} className="space-y-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-muted/30 p-6 rounded-xl border border-border">
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">1. Turma Requerente</Label>
          <Select 
            value={selectedClassId} 
            onValueChange={(val) => {
              setSelectedClassId(val || ""); 
              setSelectedStudentId(""); // Reset student
            }}
          >
            <SelectTrigger className="bg-white font-medium">
              <SelectValue placeholder="Selecione a sua turma">
                {classes.find(c => c.id === selectedClassId)?.name || "Selecione a sua turma"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {classes.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground text-center">Nenhuma turma vinculada ao seu perfil.</div>
              ) : (
                classes.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">2. Aluno</Label>
          <input type="hidden" name="studentId" value={selectedStudentId} required />
          <Select 
            value={selectedStudentId} 
            onValueChange={(val) => setSelectedStudentId(val || "")}
            disabled={!selectedClassId}
          >
            <SelectTrigger className="bg-white font-medium">
              <SelectValue placeholder={selectedClassId ? "Selecione o aluno" : "Selecione a turma primeiro"}>
                {students.find(s => s.id === selectedStudentId)?.name || (selectedClassId ? "Selecione o aluno" : "Selecione a turma primeiro")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {students.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-bold flex items-center gap-2 px-2 border-l-4 border-primary">
           Dificuldades Observadas
        </h2>
        
        <Accordion title="1. Execução do Trabalho" defaultOpen={true}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
            <SwitchItem name="diffWorkExecution" label="Execução do trabalho" />
            <SwitchItem name="diffWorkQuality" label="Qualidade do Trabalho" />
            <SwitchItem name="diffWorkPace" label="Ritmo de trabalho" />
            <SwitchItem name="diffEquipmentHandling" label="Manuseio de máquinas/equipamentos" />
            <SwitchItem name="diffInitiative" label="Iniciativa" />
            <SwitchItem name="diffParticipation" label="Participação" />
            <SwitchItem name="diffTargetAchievement" label="Cumprimento de metas" />
            <SwitchItem name="diffCommitment" label="Comprometimento" />
            <SwitchItem name="diffResultFocus" label="Foco em resultado" />
            <SwitchItem name="diffNotDoingTasks" label="Não realização de atividades" />
          </div>
        </Accordion>

        <Accordion title="2. Higiene e Segurança">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
            <SwitchItem name="diffPPEUse" label="Uso do EPI ou EPC" />
            <SwitchItem name="diffSafetyRules" label="Atendimento a normas de segurança" />
            <SwitchItem name="diffEnvironmentalCare" label="Cuidados ambientes (org./limp.)" />
            <SwitchItem name="diffPropertyCare" label="Cuidados com bens da escola" />
            <SwitchItem name="diffPersonalHygiene" label="Higiene Pessoal" />
            <SwitchItem name="diffUniformUse" label="Uso do uniforme" />
          </div>
        </Accordion>

        <Accordion title="3. Qualidades Pessoais">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
            <SwitchItem name="diffCommunication" label="Saber se comunicar" />
            <SwitchItem name="diffAbilityToListen" label="Habilidade para ouvir" />
            <SwitchItem name="diffSociability" label="Sociabilidade" />
            <SwitchItem name="diffMotivation" label="Motivação / interesse" />
            <SwitchItem name="diffDisciplinaryConduct" label="Conduta disciplinar" />
            <SwitchItem name="diffCooperation" label="Cooperação" />
            <SwitchItem name="diffAttendance" label="Assiduidade (atrasos/falta)" />
            <SwitchItem name="diffKnowledge" label="Conhecimento" />
            <SwitchItem name="diffProfessionalEthics" label="Ética profissional" />
          </div>
        </Accordion>

        <div className="px-4 py-3 bg-white border rounded-lg shadow-sm">
           <Label htmlFor="diffOther" className="text-sm font-semibold mb-2 block">Dificuldades - Outros (Opcional)</Label>
           <Textarea id="diffOther" name="diffOther" placeholder="Descreva outras dificuldades não citadas..." />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-bold flex items-center gap-2 px-2 border-l-4 border-primary">
           Ações do Docente
        </h2>

        <Accordion title="1. Sugestões para o Aluno" defaultOpen={true}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
            <SwitchItem name="actAdviseAttendance" label="Frequentar regularmente as aulas" />
            <SwitchItem name="actAdviseStudy" label="Estudar os conteúdos" />
            <SwitchItem name="actAdviseSchedule" label="Organizar horário para estudo" />
            <SwitchItem name="actAdviseNotes" label="Fazer anotações" />
            <SwitchItem name="actAdviseFocus" label="Manter-se atento" />
            <SwitchItem name="actAdviseSocialRules" label="Regras de convivência social" />
            <SwitchItem name="actAdviseTasks" label="Realizar as tarefas propostas" />
            <SwitchItem name="actAdviseParticipation" label="Participar efetivamente" />
            <SwitchItem name="actAdviseRetest" label="Refazer avaliações/exercícios" />
            <SwitchItem name="actAdviseTutoring" label="Procurar Plantão de Dúvida" />
            <SwitchItem name="actAdviseMakeUpClasses" label="Realizar reposição/recuperação" />
          </div>
        </Accordion>

        <Accordion title="2. Sugestões para Responsáveis">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
            <SwitchItem name="guardAdviseStudyHabits" label="Estimular hábitos de estudo" />
            <SwitchItem name="guardAdviseSchedule" label="Conciliar estudo e lazer" />
            <SwitchItem name="guardAdviseMonitor" label="Acompanhar desempenho escolar" />
            <SwitchItem name="guardAdviseContactSchool" label="Manter contato com a escola" />
            <SwitchItem name="guardAdviseAttendance" label="Atentar para frequência regular" />
          </div>
        </Accordion>
      </div>

      <div className="space-y-6 pt-6 border-t">
         <h2 className="text-lg font-bold flex items-center gap-2 px-2 border-l-4 border-primary">
           Encaminhamento e Info Complementar
         </h2>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-3">
             <input type="hidden" name="referral" value={referral} />
             <Label htmlFor="referral" className="font-semibold">Destino do Encaminhamento</Label>
             <Select value={referral} onValueChange={(val) => setReferral(val || "OPP")}>
               <SelectTrigger id="referral" className="bg-white">
                 <SelectValue placeholder="Selecione o setor">
                   {referralOptions.find(o => o.value === referral)?.label}
                 </SelectValue>
               </SelectTrigger>
               <SelectContent>
                 {referralOptions.map(opt => (
                   <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
           
           <div className="space-y-3">
             <Label htmlFor="provObservations" className="font-semibold">Informações Complementares</Label>
             <Textarea id="provObservations" name="provObservations" className="bg-white min-h-[100px]" placeholder="Adicione observações importantes para o setor pedagógico..." />
           </div>
         </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-8 mt-8 border-t border-border">
        <Button
          type="submit"
          name="isDraft"
          value="true"
          variant="outline"
          size="lg"
          className="gap-2"
          disabled={!selectedStudentId}
        >
          <Save size={18} /> Salvar Rascunho
        </Button>
        
        <Button
          type="submit"
          name="isDraft"
          value="false"
          size="lg"
          className="gap-2"
          title="A Ficha vai diretamente para o setor selecionado"
          disabled={!selectedStudentId}
        >
          <Send size={18} /> Enviar FIAA
        </Button>
      </div>
    </form>
  );
}

function SwitchItem({ name, label }: { name: string, label: string }) {
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-3 hover:bg-muted/40 transition-colors shadow-sm bg-white cursor-pointer group"
         onClick={(e) => {
           // Se o clique não foi no próprio switch, dispara o clique no switch via label/id
           if ((e.target as HTMLElement).tagName !== 'BUTTON') {
             const element = document.getElementById(name);
             if (element) element.click();
           }
         }}>
      <div className="space-y-0.5">
        <Label htmlFor={name} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
      </div>
      <Switch id={name} name={name} value="on" />
    </div>
  );
}
