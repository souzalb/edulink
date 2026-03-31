"use client";

import { useState } from "react";
import { createFiaaAction } from "./actions";
import Accordion from "@/components/ui/Accordion";
import { Save, Send } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Student = { id: string; name: string };
type ClassType = { id: string; name: string; students: Student[] };

export function FiaaForm({ classes }: { classes: ClassType[] }) {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

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
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Selecione a sua turma" />
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
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={selectedClassId ? "Selecione o aluno" : "Selecione a turma primeiro"} />
            </SelectTrigger>
            <SelectContent>
              {students.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Accordion title="Dificuldades Observadas" defaultOpen={true}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
          <SwitchItem name="diffWorkExecution" label="Execução do trabalho" />
          <SwitchItem name="diffWorkQuality" label="Qualidade do Trabalho" />
          <SwitchItem name="diffPPEUse" label="Uso do EPI ou EPC" />
          <SwitchItem name="diffWorkPace" label="Ritmo de trabalho" />
          <SwitchItem name="diffSafetyRules" label="Atendimento às regras de segurança" />
          <SwitchItem name="diffPersonalHygiene" label="Higiene Pessoal" />
          <SwitchItem name="diffDisciplinaryConduct" label="Conduta Disciplinar" />
        </div>
      </Accordion>

      <Accordion title="Sugestões / Ações Tomadas pelo Docente">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
          <SwitchItem name="actAdviseAttendance" label="Frequentar regularmente as aulas" />
          <SwitchItem name="actAdviseStudy" label="Estudar os conteúdos desenvolvidos" />
          <SwitchItem name="actAdviseTutoring" label="Procurar Plantão de Dúvidas" />
        </div>
      </Accordion>

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
          title="A Ficha vai diretamente para a Orientação"
          disabled={!selectedStudentId}
        >
          <Send size={18} /> Enviar p/ Orientação
        </Button>
      </div>
    </form>
  );
}

function SwitchItem({ name, label }: { name: string, label: string }) {
  // We use standard checkbox hidden input to map to the switch value for native FormData submission
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-3 hover:bg-muted/40 transition-colors shadow-sm bg-white">
      <div className="space-y-0.5">
        <Label htmlFor={name} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
      </div>
      <Switch id={name} name={name} value="on" />
    </div>
  );
}
