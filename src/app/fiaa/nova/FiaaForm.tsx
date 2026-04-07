"use client";

import { useState } from "react";
import { createFiaaAction } from "./actions";
import Accordion from "@/components/ui/Accordion";
import { Save, Send, Sparkles, User, Users, FileText, ClipboardCheck, ArrowRight, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
    <form action={createFiaaAction} className="space-y-12 relative pb-20">

      {/* 1. SELEÇÃO DE CONTEXTO */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-primary/5"
      >
        {/* Background mesh for the card */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-8 pb-8 border-b border-white/10">
          <div className="space-y-2">
            <h2 className="text-2xl font-black font-heading text-foreground tracking-tightest leading-none text-glow flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Sparkles size={24} className="text-primary animate-pulse" />
              </div>
              Contexto Pedagógico
            </h2>
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest pl-14 italic opacity-60">Escolha a turma e o respectivo aluno para emissão da FIAA.</p>
          </div>

          <div className="flex items-center gap-3 bg-muted/30 px-5 py-2.5 rounded-2xl border border-border/40 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Edição em Tempo Real
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          <div className="space-y-4">
            <Label className="text-[10px] font-black font-heading text-primary uppercase tracking-widest pl-1 flex items-center gap-2">
              <Users size={14} /> 1. Turma Requerente
            </Label>
            <Select
              value={selectedClassId}
              onValueChange={(val) => {
                setSelectedClassId(val || "");
                setSelectedStudentId(""); // Reset student
              }}
            >
              <SelectTrigger className="glass-input h-14 rounded-2xl font-black text-lg transition-all focus:ring-[8px]">
                <SelectValue placeholder="Selecione a Turma">
                  {classes.find(c => c.id === selectedClassId)?.name || "Selecione a Turma"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="glass-card rounded-2xl border-white/20 p-2">
                {classes.map(c => (
                  <SelectItem key={c.id} value={c.id} className="rounded-xl cursor-pointer py-3 font-bold transition-all data-[state=checked]:bg-primary pulse">
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black font-heading text-primary uppercase tracking-widest pl-1 flex items-center gap-2">
              <User size={14} /> 2. Aluno em Destaque
            </Label>
            <input type="hidden" name="studentId" value={selectedStudentId} required />
            <Select
              value={selectedStudentId}
              onValueChange={(val) => setSelectedStudentId(val || "")}
              disabled={!selectedClassId}
            >
              <SelectTrigger className={cn(
                "glass-input h-14 rounded-2xl font-black text-lg transition-all focus:ring-[8px]",
                !selectedClassId && "opacity-30 cursor-not-allowed"
              )}>
                <SelectValue placeholder={selectedClassId ? "Selecione o aluno" : "Aguardando Turma..."}>
                  {students.find(s => s.id === selectedStudentId)?.name || (selectedClassId ? "Selecione o aluno" : "Aguardando Turma...")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="glass-card rounded-2xl border-white/20 p-2">
                {students.map(s => (
                  <SelectItem key={s.id} value={s.id} className="rounded-xl cursor-pointer py-3 font-bold">
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* 2. DIFICULDADES */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4 px-2">
          <div className="h-12 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(237,28,36,0.5)]" />
          <h2 className="text-3xl font-heading font-black text-foreground tracking-tightest uppercase-none text-glow">
            Mapeamento de Dificuldades
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <Accordion title="1. Execução Técnica & Social" defaultOpen={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                <SwitchItem name="diffWorkExecution" label="Execução do trabalho" icon={<Zap size={14} />} />
                <SwitchItem name="diffWorkQuality" label="Qualidade do Trabalho" icon={<Sparkles size={14} />} />
                <SwitchItem name="diffWorkPace" label="Ritmo de trabalho" />
                <SwitchItem name="diffEquipmentHandling" label="Máquinas/Equipamentos" />
                <SwitchItem name="diffInitiative" label="Iniciativa Própria" />
                <SwitchItem name="diffParticipation" label="Participação Ativa" />
                <SwitchItem name="diffTargetAchievement" label="Cumprimento de Metas" />
                <SwitchItem name="diffCommitment" label="Comprometimento" />
                <SwitchItem name="diffResultFocus" label="Foco em Resultados" />
                <SwitchItem name="diffNotDoingTasks" label="Atividades Pendentes" />
              </div>
            </Accordion>

            <Accordion title="2. Ambiência e Conformidade">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                <SwitchItem name="diffPPEUse" label="Uso do EPI / EPC" />
                <SwitchItem name="diffSafetyRules" label="Normas de Segurança" />
                <SwitchItem name="diffEnvironmentalCare" label="Organização/Limpeza" />
                <SwitchItem name="diffPropertyCare" label="Zelo Patrimonial" />
                <SwitchItem name="diffPersonalHygiene" label="Higiene Pessoal" />
                <SwitchItem name="diffUniformUse" label="Uso do Uniforme" />
              </div>
            </Accordion>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-8 rounded-[2rem] h-full flex flex-col">
              <Label htmlFor="diffOther" className="text-[10px] font-black text-primary uppercase tracking-widest italic mb-4 block">Outras Observações</Label>
              <Textarea
                id="diffOther"
                name="diffOther"
                className="flex-1 glass-input rounded-2xl min-h-[200px] font-bold p-6 placeholder:text-muted-foreground/30 text-lg border-white/5"
                placeholder="Algo mais que o setor pedagógico deve saber?"
              />
              <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 text-[10px] font-black text-primary uppercase tracking-widest text-center animate-float">
                Capturando Detalhes do Perfil
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. AÇÕES & DESTINO */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card p-10 rounded-[2.5rem] bg-gradient-to-br from-card via-background/20 to-card shadow-2xl shadow-primary/5"
      >
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-heading font-black text-foreground tracking-tightest uppercase-none text-glow flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-xl">
                  <ArrowRight size={20} className="text-indigo-500" />
                </div>
                Próxima Etapa
              </h3>
              <input type="hidden" name="referral" value={referral} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {referralOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setReferral(opt.value)}
                    className={cn(
                      "p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all text-center cursor-pointer",
                      referral === opt.value
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105"
                        : "bg-background/40 text-muted-foreground border-white/10 hover:bg-background/60"
                    )}
                  >
                    {opt.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black text-primary uppercase tracking-widest italic pl-1">Informações de Gestão</Label>
              <Textarea
                name="provObservations"
                className="glass-input rounded-2xl min-h-[120px] font-bold p-6 placeholder:text-muted-foreground/30 text-lg border-white/5"
                placeholder="Observações de encaminhamento..."
              />
            </div>
          </div>

          <div className="w-full md:w-[340px] flex flex-col gap-4">
            <Button
              type="submit"
              name="isDraft"
              value="false"
              className="w-full h-24 rounded-3xl bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-[0_20px_40px_rgba(237,28,36,0.3)] transition-all active:scale-[0.97] cursor-pointer flex flex-col items-center justify-center gap-1 group"
              disabled={!selectedStudentId}
            >
              <Send size={24} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
              <span className="tracking-tightest uppercase-none">Enviar FIAA</span>
            </Button>

            <Button
              type="submit"
              name="isDraft"
              value="true"
              variant="outline"
              className="w-full h-16 rounded-2xl glass-input font-black text-muted-foreground/60 hover:text-foreground transition-all cursor-pointer border-white/10"
              disabled={!selectedStudentId}
            >
              <Save size={18} /> Salvar Rascunho
            </Button>

            <div className="mt-auto p-5 rounded-2xl bg-muted/20 border border-border/20 text-center space-y-2">
              <div className="flex justify-center">
                <ClipboardCheck size={24} className="text-emerald-500/50" />
              </div>
              <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest leading-relaxed">
                Todos os dados serão analisados pela coordenação técnica da unidade.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

    </form>
  );
}

function SwitchItem({ name, label, icon }: { name: string, label: string, icon?: React.ReactNode }) {
  return (
    <div className="group flex flex-row items-center justify-between glass-card p-4 rounded-2xl border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all shadow-sm hover:shadow-primary/5 cursor-pointer"
      onClick={(e) => {
        if ((e.target as HTMLElement).tagName !== 'BUTTON') {
          const element = document.getElementById(name);
          if (element) element.click();
        }
      }}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-muted/40 text-muted-foreground/60 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          {icon || <FileText size={14} />}
        </div>
        <Label htmlFor={name} className="text-[11px] font-black uppercase tracking-tightest cursor-pointer group-hover:text-foreground transition-colors">
          {label}
        </Label>
      </div>
      <Switch id={name} name={name} value="on" className="data-[state=checked]:bg-primary shadow-sm" />
    </div>
  );
}
