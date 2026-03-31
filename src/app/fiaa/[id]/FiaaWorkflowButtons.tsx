"use client";

import { Button } from "@/components/ui/button";
import { updateFiaaStatus } from "./actions";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

export function FiaaWorkflowButtons({ fiaaId, currentStatus }: { fiaaId: string, currentStatus: string }) {
  
  async function handleUpdate(newStatus: string) {
    await updateFiaaStatus(fiaaId, newStatus);
  }

  if (currentStatus !== "PENDING_OPP") {
     return null; // Apenas mostra as ações de workflow se a FIAA estiver na caixa de entrada
  }

  return (
    <div className="flex flex-wrap gap-4 pt-6 border-t border-border mt-8">
      <Button 
        variant="outline" 
        className="gap-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
        onClick={() => handleUpdate("PENDING_TEACHER")}
      >
        <ArrowLeft size={16}/> Retornar ao Docente
      </Button>
      <Button 
         variant="outline"
         className="gap-2 border-amber-500 text-amber-700 hover:bg-amber-50"
         onClick={() => handleUpdate("PENDING_GUARDIAN")}
      >
        <XCircle size={16}/> Encaminhar s/ Concordância
      </Button>
      <Button 
        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={() => handleUpdate("CONCLUDED")}
      >
        <CheckCircle2 size={16}/> Concluir Atendimento
      </Button>
    </div>
  );
}
