"use client";

import { FiaaStatus } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, MoreVertical, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Simplified type for the Kanban
interface KanbanFIAA {
  id: string;
  studentName: string;
  className: string;
  teacherName: string;
  createdAt: Date;
  status: FiaaStatus;
}

interface StatusKanbanProps {
  items: KanbanFIAA[];
}

const statusConfig = {
  [FiaaStatus.DRAFT]: { label: "Rascunho", bg: "bg-gray-100", border: "border-gray-200" },
  [FiaaStatus.PENDING_OPP]: { label: "Aguardando OPP", bg: "bg-amber-50", border: "border-amber-200" },
  [FiaaStatus.ESCALATED]: { label: "Escalonado", bg: "bg-orange-50", border: "border-orange-200" },
  [FiaaStatus.PENDING_SIGNATURES]: { label: "Aguard. Assinaturas", bg: "bg-blue-50", border: "border-blue-200" },
  [FiaaStatus.CLOSED]: { label: "Encerrado", bg: "bg-green-50", border: "border-green-200" },
  [FiaaStatus.ARCHIVED]: { label: "Arquivado", bg: "bg-slate-50", border: "border-slate-200" },
};

const defaultColumns = [
  FiaaStatus.PENDING_OPP,
  FiaaStatus.ESCALATED,
  FiaaStatus.PENDING_SIGNATURES,
  FiaaStatus.CLOSED,
];

export default function StatusKanban({ items }: StatusKanbanProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter((item) =>
    item.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full flex justify-center flex-col pb-8">
      <div className="mb-6 max-w-sm relative">
        <span className="absolute left-3 top-2.5 text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Buscar aluno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4 items-start">
        {defaultColumns.map((status) => {
          const colItems = filteredItems.filter((item) => item.status === status);
          const config = statusConfig[status];

          return (
            <div
              key={status}
              className={`flex-shrink-0 w-full lg:w-80 rounded-xl border ${config.border} bg-white flex flex-col max-h-[75vh]`}
            >
              <div className={`p-4 border-b ${config.border} rounded-t-xl ${config.bg} flex justify-between items-center`}>
                <h3 className="font-semibold text-gray-800">{config.label}</h3>
                <span className="bg-white/60 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                  {colItems.length}
                </span>
              </div>
              
              <div className="p-3 flex-1 overflow-y-auto space-y-3 bg-gray-50/50">
                {colItems.length === 0 ? (
                  <div className="text-center py-8 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                    Nenhuma ficha nesta etapa
                  </div>
                ) : (
                  colItems.map((item) => (
                    <Link href={`/fiaa/${item.id}`} key={item.id} className="block transition-transform hover:-translate-y-1">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-semibold px-2 py-1 rounded-md bg-gray-100 text-gray-600">
                            {item.className}
                          </span>
                          <button className="text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                        <h4 className="font-bold text-gray-800 text-sm mb-1">{item.studentName}</h4>
                        <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                          <FileText size={12} /> Emitido por {item.teacherName}
                        </div>
                        <div className="text-right text-[10px] text-gray-400 font-medium">
                          {format(item.createdAt, "dd 'de' MMM, HH:mm", { locale: ptBR })}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
