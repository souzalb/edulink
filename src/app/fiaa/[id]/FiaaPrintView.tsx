"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function FiaaPrintView({ fiaa }: { fiaa: any }) {
  const renderFields = (fields: { key: string, label: string }[]) => {
    return fields
      .filter(f => fiaa[f.key] === true)
      .map(f => f.label)
      .join(", ");
  };

  return (
    <div className="print-only p-4 bg-white text-black font-serif min-h-0">
      {/* Header Timbrado */}
      <div className="border-b-2 border-black pb-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 flex items-center justify-center rounded">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tighter">SENAI MARIANO FERRAZ</h1>
            <p className="text-xs uppercase font-semibold">Unidade de Ensino e Tecnologia</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-sm font-bold uppercase">Edulink - Sistema Pedagógico</h2>
          <p className="text-[9px]">Documento Emitido em: {format(new Date(), "dd/MM/yyyy HH:mm")}</p>
        </div>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-lg font-bold underline uppercase">FICHA DE INDICADORES DE APOIO AO APRENDIZADO (FIAA)</h3>
        <p className="text-xs mt-0.5">Identificação e Acompanhamento Pedagógico</p>
      </div>

      {/* Dados Principais */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-8 mb-6 border p-3 rounded bg-gray-50/10">
        <div>
          <label className="text-[10px] font-bold uppercase block text-gray-500">Aluno(a)</label>
          <div className="font-bold border-b border-black/20 pb-1">{fiaa.student.name}</div>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase block text-gray-500">Turma</label>
          <div className="font-bold border-b border-black/20 pb-1">{fiaa.student.class.name}</div>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase block text-gray-500">Professor Relator</label>
          <div className="font-bold border-b border-black/20 pb-1">{fiaa.teacher.name}</div>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase block text-gray-500">Data de Emissão</label>
          <div className="font-bold border-b border-black/20 pb-1">
            {format(new Date(fiaa.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </div>
        </div>
      </div>

      {/* Observações do Professor */}
      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase bg-black text-white px-2 py-1 inline-block">1. Dificuldades Observadas</h4>
          <div className="text-sm border-l-2 border-black pl-4 py-1">
            <div><strong>Execução:</strong> {renderFields([
              { key: 'diffWorkExecution', label: "Execução do trabalho" },
              { key: 'diffWorkQuality', label: "Qualidade do Trabalho" },
              { key: 'diffWorkPace', label: "Ritmo de trabalho" },
              { key: 'diffEquipmentHandling', label: "Manuseio de máquinas" },
              { key: 'diffInitiative', label: "Iniciativa" },
              { key: 'diffParticipation', label: "Participação" },
              { key: 'diffTargetAchievement', label: "Cumprimento de metas" },
              { key: 'diffCommitment', label: "Comprometimento" },
              { key: 'diffResultFocus', label: "Foco em resultado" },
              { key: 'diffNotDoingTasks', label: "Não realização de atividades" },
            ]) || "Nenhum apontamento."}</div>
            
            <div className="mt-2"><strong>Comportamento/Higiene:</strong> {renderFields([
              { key: 'diffPPEUse', label: "Uso do EPI" },
              { key: 'diffSafetyRules', label: "Segurança" },
              { key: 'diffEnvironmentalCare', label: "Cuidados ambientais" },
              { key: 'diffPropertyCare', label: "Cuidados com patrimônio" },
              { key: 'diffPersonalHygiene', label: "Higiene Pessoal" },
              { key: 'diffUniformUse', label: "Uso do uniforme" },
            ]) || "Nenhum apontamento."}</div>

            <div className="mt-2"><strong>Qualidades Pessoais:</strong> {renderFields([
              { key: 'diffCommunication', label: "Comunicação" },
              { key: 'diffAbilityToListen', label: "Escuta" },
              { key: 'diffSociability', label: "Sociabilidade" },
              { key: 'diffMotivation', label: "Motivação" },
              { key: 'diffDisciplinaryConduct', label: "Conduta" },
              { key: 'diffCooperation', label: "Cooperação" },
              { key: 'diffAttendance', label: "Assiduidade" },
            ]) || "Nenhum apontamento."}</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase bg-black text-white px-2 py-1 inline-block">2. Ações do Docente</h4>
          <div className="text-sm border-l-2 border-black pl-4 py-1">
            {renderFields([
              { key: 'actAdviseAttendance', label: "Frequentar aulas" },
              { key: 'actAdviseStudy', label: "Estudar conteúdos" },
              { key: 'actAdviseSchedule', label: "Organizar horário" },
              { key: 'actAdviseNotes', label: "Fazer anotações" },
              { key: 'actAdviseFocus', label: "Manter atenção" },
              { key: 'actAdviseTasks', label: "Realizar tarefas" },
              { key: 'actAdviseRetest', label: "Refazer avaliações" },
            ]) || "Sugestões padrões orientadas verbalmente."}
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5 inline-block">3. Observações Complementares</h4>
          <div className="text-[13px] border border-black p-3 rounded italic min-h-[40px]">
            {fiaa.provObservations || "Nenhuma observação adicional."}
          </div>
        </div>
      </div>

      {/* Retorno Gestão */}
      {(fiaa.feedbackPedagogico || fiaa.acoesPedagogico) && (
        <div className="space-y-3 mb-6 bg-gray-100/30 p-4 border-2 border-black/10 rounded">
          <h4 className="text-xs font-bold uppercase text-center border-b border-black/20 pb-1 mb-2">Retorno da Orientação Pedagógica</h4>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="text-[10px] font-bold uppercase block mb-1">Feedback ao Professor:</label>
              <p className="text-xs italic">{fiaa.feedbackPedagogico || "N/A"}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase block mb-1">Ações Implementadas:</label>
              <p className="text-xs italic">{fiaa.acoesPedagogico || "N/A"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Assinaturas */}
      <div className="mt-10 grid grid-cols-3 gap-8 text-center">
        <div className="space-y-2">
          <div className="border-t border-black pt-2 text-xs font-bold uppercase">Professor(a) Relator(a)</div>
          <div className="text-[10px] text-gray-500 italic">{fiaa.teacher.name}</div>
        </div>
        <div className="space-y-2">
          <div className="border-t border-black pt-2 text-xs font-bold uppercase">Orientação Pedagógica</div>
        </div>
        <div className="space-y-2">
          <div className="border-t border-black pt-2 text-xs font-bold uppercase">Responsável / Aluno</div>
        </div>
      </div>

      {/* Footer Print */}
      <div className="absolute bottom-10 left-10 right-10 text-center text-[9px] text-gray-400 font-sans border-t pt-4">
        Este documento é de uso interno do SENAI e contém informações pedagógicas confidenciais.
      </div>
    </div>
  );
}
