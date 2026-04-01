"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateFiaaStatus } from "./actions";
import { CheckCircle2, XCircle, ArrowLeft, MessageSquare, ClipboardList, TrendingUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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

  const gridCols = cn(
    "grid grid-cols-1 gap-4",
    (canEscalate || canReturnToAQV) ? "sm:grid-cols-4" : "sm:grid-cols-3"
  );

  return (
    <div className="space-y-8 pt-8 border-t border-border mt-10">
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <ClipboardList size={16} /> Registro de Retorno Pedagógico
        </h3>
        
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 bg-white p-4 rounded-xl border border-border shadow-sm">
            <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-2">
              <MessageSquare size={14} className="text-primary"/> Feedback ao Professor
            </label>
            <Textarea 
              placeholder="Digite aqui as orientações ou feedback para o docente..."
              className="min-h-[120px] resize-none border-none bg-zinc-50 focus-visible:ring-0 p-4 text-sm rounded-lg"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground italic border-t pt-2 mt-2">
              Este texto será visível para o professor que relatou a FIAA.
            </p>
          </div>
          <div className="space-y-3 bg-white p-4 rounded-xl border border-border shadow-sm">
            <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-2">
              <ClipboardList size={14} className="text-primary"/> Ações Tomadas pela Gestão
            </label>
            <Textarea 
              placeholder="Descreva as providências tomadas (ex: reunião, orientação ao aluno, contato telefônico)..."
              className="min-h-[120px] resize-none border-none bg-zinc-50 focus-visible:ring-0 p-4 text-sm rounded-lg"
              value={acoes}
              onChange={(e) => setAcoes(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground italic border-t pt-2 mt-2">
              Registro interno das providências realizadas pela coordenação/AQV.
            </p>
          </div>
        </div>
      </div>

      {/* Decision Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 size={16} /> Definir Próximo Passo do Fluxo
        </h3>

        <div className={gridCols}>
          
          {/* Action: Escalate (Only for AQV) */}
          {canEscalate && (
            <div className="group relative flex flex-col p-4 bg-white rounded-xl border border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all shadow-sm">
              <Button 
                  className="gap-2 mb-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 cursor-pointer transition-all active:scale-95"
                  onClick={() => handleUpdate("PENDING_OPP", "OPP")}
                  disabled={loading}
                >
                  <TrendingUp size={16}/> Escalar p/ Orientação
                </Button>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Utilize para <strong>transferir o caso</strong> para a Orientação/Coordenação quando o atendimento ultrapassa a alçada da AQV.
                </p>
            </div>
          )}

          {/* Action: Return to AQV (Only for OPP) */}
          {canReturnToAQV && (
            <div className="group relative flex flex-col p-4 bg-white rounded-xl border border-violet-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all shadow-sm">
              <Button 
                  className="gap-2 mb-3 w-full bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/10 cursor-pointer transition-all active:scale-95"
                  onClick={() => handleUpdate("PENDING_OPP", "AQV")}
                  disabled={loading}
                >
                  <ArrowLeft size={16}/> Retornar ao AQV
                </Button>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Utilize para <strong>devolver o caso</strong> para a equipe de AQV caso identifique que a demanda é estritamente psicossocial.
                </p>
            </div>
          )}

          {/* Action: Return to Teacher */}
          <div className="group relative flex flex-col p-4 bg-white rounded-xl border border-border hover:border-red-200 hover:bg-red-50/30 transition-all shadow-sm">
             <Button 
                className="gap-2 mb-3 w-full bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/10 cursor-pointer transition-all active:scale-95"
                onClick={() => handleUpdate("PENDING_TEACHER")}
                disabled={loading}
              >
                <ArrowLeft size={16}/> Retornar ao Docente
              </Button>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Use este botão se as informações estiverem <strong>incompletas</strong> ou se o professor precisar realizar uma ação adicional antes de prosseguir.
              </p>
          </div>

          {/* Action: Forward to Guardian */}
          <div className="group relative flex flex-col p-4 bg-white rounded-xl border border-border hover:border-amber-200 hover:bg-amber-50/30 transition-all shadow-sm">
            <Button 
               className="gap-2 mb-3 w-full bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/10 cursor-pointer transition-all active:scale-95"
               onClick={() => handleUpdate("PENDING_GUARDIAN")}
               disabled={loading}
            >
              <XCircle size={16}/> Encaminhar s/ Concordância
            </Button>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Use para <strong>avançar o fluxo</strong> para a etapa do Responsável (Pai/Mãe) mesmo quando não houve um acordo total ou ciência imediata.
            </p>
          </div>

          {/* Action: Conclude */}
          <div className="group relative flex flex-col p-4 bg-white rounded-xl border border-zinc-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all shadow-sm">
            <Button 
              className="gap-2 mb-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10 cursor-pointer transition-all active:scale-95"
              onClick={() => handleUpdate("CONCLUDED")}
              disabled={loading}
            >
              <CheckCircle2 size={16}/> Concluir Atendimento
            </Button>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Use quando a demanda foi <strong>totalmente resolvida</strong> pela gestão e não requer mais etapas de acompanhamento externo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
