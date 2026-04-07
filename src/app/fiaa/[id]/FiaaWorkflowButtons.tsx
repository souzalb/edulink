"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateFiaaStatus } from "./actions";
import { CheckCircle2, XCircle, ArrowLeft, MessageSquare, ClipboardList, TrendingUp, Sparkles, Send, ShieldCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function FiaaWorkflowButtons({ 
  fiaaId, 
  currentStatus, 
  userRole, 
  currentReferral 
}: { 
  fiaaId: string, 
  currentStatus: string, 
  userRole: string, 
  currentReferral: string 
}) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [acoes, setAcoes] = useState("");
  
  async function handleUpdate(newStatus: any, newReferral?: string) {
    setLoading(true);
    try {
      await updateFiaaStatus(fiaaId, newStatus, feedback, acoes, newReferral);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar status");
    } finally {
      setLoading(false);
    }
  }

  if (currentStatus !== "PENDING_OPP") {
     return null; 
  }

  const isAQV = userRole === "AQV_OE";
  const isOPP = userRole === "OPP";
  const canEscalate = isAQV && (currentReferral === "AQV" || currentReferral === "OE");
  const canReturnToAQV = isOPP && (currentReferral === "OPP" || currentReferral === "COORD");

  return (
    <div className="space-y-12 pt-16 border-t border-white/5 mt-16 transition-all duration-700">
      
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         className="space-y-8"
      >
        <div className="flex items-center gap-4 px-2">
           <div className="h-10 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(237,28,36,0.5)]" />
           <h3 className="text-2xl font-heading font-black text-foreground tracking-tightest uppercase-none text-glow flex items-center gap-3">
              Registro de Providências
              <Sparkles size={18} className="text-primary animate-pulse" />
           </h3>
        </div>
        
        {/* INPUT STAGE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-8 rounded-[2.5rem] space-y-4 hover:shadow-2xl hover:shadow-primary/5 transition-all">
            <div className="flex items-center justify-between">
               <label className="text-[10px] font-black text-primary uppercase tracking-widest pl-2 italic flex items-center gap-2">
                  <MessageSquare size={14}/> Feedback ao Professor
               </label>
               <div className="w-2 h-2 rounded-full bg-emerald-500/40 animate-pulse" />
            </div>
            <Textarea 
              placeholder="Digite aqui as orientações ou feedback para o docente..."
              className="min-h-[160px] glass-input rounded-2xl border-white/5 font-bold p-6 text-lg placeholder:text-muted-foreground/30 focus:ring-[8px]"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <p className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest text-center pt-2 italic">
              Visível no painel do docente solicitante.
            </p>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] space-y-4 hover:shadow-2xl hover:shadow-primary/5 transition-all">
            <div className="flex items-center justify-between">
               <label className="text-[10px] font-black text-primary uppercase tracking-widest pl-2 italic flex items-center gap-2">
                  <ShieldCheck size={14}/> Ações da Gestão Técnica
               </label>
               <div className="w-2 h-2 rounded-full bg-indigo-500/40 animate-pulse" />
            </div>
            <Textarea 
              placeholder="Descreva as providências tomadas internamente..."
              className="min-h-[160px] glass-input rounded-2xl border-white/5 font-bold p-6 text-lg placeholder:text-muted-foreground/30 focus:ring-[8px]"
              value={acoes}
              onChange={(e) => setAcoes(e.target.value)}
            />
            <p className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest text-center pt-2 italic">
              Registro histórico para auditoria interna.
            </p>
          </div>
        </div>
      </motion.div>

      {/* DECISION STAGE */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         className="space-y-8"
      >
        <div className="flex items-center gap-4 px-2">
           <div className="h-10 w-1 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
           <h3 className="text-2xl font-heading font-black text-foreground tracking-tightest uppercase-none text-glow">
              Status Operacional
           </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {canEscalate && (
            <DecisionCard 
              label="Escalar p/ Coord." 
              color="bg-indigo-600" 
              icon={<TrendingUp size={20}/>}
              description="Transfere o dossiê para análise da Coordenação de Curso."
              onClick={() => handleUpdate("PENDING_OPP", "OPP")}
              loading={loading}
            />
          )}

          {canReturnToAQV && (
            <DecisionCard 
              label="Retornar ao AQV" 
              color="bg-violet-600" 
              icon={<ArrowLeft size={20}/>}
              description="Devolve o atendimento para a equipe psicossocial."
              onClick={() => handleUpdate("PENDING_OPP", "AQV")}
              loading={loading}
            />
          )}

          <DecisionCard 
            label="Incompleto / Docente" 
            color="bg-amber-600" 
            icon={<ArrowLeft size={20}/>}
            description="Solicita mais dados ou correções ao professor."
            onClick={() => handleUpdate("PENDING_TEACHER")}
            loading={loading}
          />

          <DecisionCard 
            label="Chamar Responsável" 
            color="bg-rose-600" 
            icon={<XCircle size={20}/>}
            description="Convoca os pais/tutores para reunião presencial."
            onClick={() => handleUpdate("PENDING_GUARDIAN")}
            loading={loading}
          />

          <DecisionCard 
            label="Concluir Fluxo" 
            color="bg-emerald-600" 
            icon={<Send size={20}/>}
            description="Finaliza o dossiê com todas as metas atingidas."
            onClick={() => handleUpdate("CONCLUDED")}
            loading={loading}
            fullWidth={!(canEscalate || canReturnToAQV)}
          />

        </div>
      </motion.div>
    </div>
  );
}

function DecisionCard({ label, color, icon, description, onClick, loading, fullWidth }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className={cn(
        "glass-card p-6 rounded-[2rem] border-white/5 hover:border-white/20 transition-all flex flex-col items-start gap-4 text-left group cursor-pointer active:scale-[0.97]",
        fullWidth && "sm:col-span-2 shadow-2xl shadow-emerald-500/10"
      )}
    >
      <div className={cn("p-3 rounded-2xl text-white shadow-xl transition-transform group-hover:scale-110 duration-500", color)}>
        {icon}
      </div>
      <div className="space-y-1">
         <span className="text-[11px] font-black uppercase tracking-tightest group-hover:text-primary transition-colors text-foreground">{label}</span>
         <p className="text-[10px] font-bold text-muted-foreground/60 leading-relaxed font-sans">{description}</p>
      </div>
      <div className="mt-auto pt-4 flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-all">
         <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
         <span className="text-[9px] font-black uppercase tracking-widest">Executar Ação</span>
      </div>
    </button>
  );
}
