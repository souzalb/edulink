"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, Search, Filter, Calendar, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

type FiaaData = {
  id: string;
  studentName: string;
  className: string;
  teacherName: string;
  createdAt: Date;
  status: string;
};

export function FiaaDataTable({ items }: { items: FiaaData[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [classFilter, setClassFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Get unique classes for the filter
  const uniqueClasses = useMemo(() => {
    const classes = Array.from(new Set(items.map((item) => item.className)));
    return classes.sort();
  }, [items]);

  const filteredItems = items.filter((item) => {
    // Search term (Student or Teacher)
    const matchesSearch = 
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status Filter
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

    // Class Filter
    const matchesClass = classFilter === "ALL" || item.className === classFilter;

    // Date Filter (Range) using string comparison to avoid TZ issues
    let matchesDate = true;
    const itemDateStr = format(new Date(item.createdAt), "yyyy-MM-dd");

    if (startDate && itemDateStr < startDate) matchesDate = false;
    if (endDate && matchesDate && itemDateStr > endDate) matchesDate = false;

    return matchesSearch && matchesStatus && matchesClass && matchesDate;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setClassFilter("ALL");
    setStartDate("");
    setEndDate("");
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "DRAFT":
        return { label: "Rascunho", className: "bg-gray-100 text-gray-700 border-gray-200" };
      case "PENDING_OPP":
        return { label: "Aguardando Orientação", className: "bg-amber-100 text-amber-700 border-amber-200" };
      case "PENDING_TEACHER":
        return { label: "Retornado ao Docente", className: "bg-blue-100 text-blue-700 border-blue-200" };
      case "PENDING_GUARDIAN":
        return { label: "Aguardando Responsável", className: "bg-purple-100 text-purple-700 border-purple-200" };
      case "CONCLUDED":
        return { label: "Concluído", className: "bg-emerald-100 text-emerald-700 border-emerald-200" };
      default:
        return { label: status, className: "" };
    }
  };

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "ALL" || classFilter !== "ALL" || startDate !== "" || endDate !== "";

  return (
    <div className="space-y-4">
      {/* Search and Main Filters Row */}
      <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-start">
          {/* Search Input */}
          <div className="space-y-2 w-full">
            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2 h-4">
              <Search size={14}/> Buscar
            </label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Aluno ou docente..." 
                className="pl-9 h-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Class Select */}
          <div className="space-y-2 w-full">
            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2 h-4">
              <Filter size={14}/> Turma
            </label>
            <Select value={classFilter} onValueChange={(val) => setClassFilter(val || "ALL")}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Selecione a Turma">
                    {classFilter === "ALL" ? "Todas as Turmas" : classFilter}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas as Turmas</SelectItem>
                  {uniqueClasses.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
            </Select>
          </div>

          {/* Status Select */}
          <div className="space-y-2 w-full">
            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2 h-4">
              <CheckCircle2 size={14}/> Status
            </label>
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Selecione o Status">
                  {statusFilter === "ALL" ? "Todos os Status" : getStatusInfo(statusFilter).label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os Status</SelectItem>
                <SelectItem value="DRAFT">Rascunho</SelectItem>
                <SelectItem value="PENDING_OPP">Aguardando Orientação</SelectItem>
                <SelectItem value="PENDING_TEACHER">Retornado ao Docente</SelectItem>
                <SelectItem value="PENDING_GUARDIAN">Aguardando Responsável</SelectItem>
                <SelectItem value="CONCLUDED">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2 w-full">
            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2 h-4">
              <Calendar size={14}/> Data Inicial
            </label>
            <Input 
              type="date"
              className="h-10 w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="space-y-2 w-full">
            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2 h-4">
              <Calendar size={14}/> Data Final
            </label>
            <Input 
              type="date"
              className="h-10 w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Clear Filters Button */}
          <div className="space-y-2 w-full">
            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2 h-4">
              {/* Spacer matching labels */}
            </label>
            {hasActiveFilters ? (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="h-10 w-full gap-2 text-red-500 border-red-200 hover:bg-red-50 transition-colors"
                title="Limpar todos os filtros"
              >
                <X size={16} /> Limpar Filtros
              </Button>
            ) : (
              <div className="h-10 w-full border border-dashed border-gray-200 rounded-lg bg-gray-50/50 flex items-center justify-center text-[10px] text-gray-300 font-medium uppercase tracking-widest px-2">
                Sem Filtros Alt.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[120px] py-4">Data Criação</TableHead>
                <TableHead className="py-4">Aluno</TableHead>
                <TableHead className="py-4">Turma</TableHead>
                <TableHead className="py-4">Professor Relator</TableHead>
                <TableHead className="py-4">Status</TableHead>
                <TableHead className="text-right py-4">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-inter">
                    Nenhuma FIAA encontrada com os filtros atuais.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => {
                  const statusInfo = getStatusInfo(item.status);
                  return (
                    <TableRow 
                      key={item.id} 
                      className="hover:bg-muted/30 transition-colors cursor-pointer group"
                      onClick={() => router.push(`/fiaa/${item.id}`)}
                    >
                      <TableCell className="font-medium text-xs text-muted-foreground py-4">
                        {format(new Date(item.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="font-bold text-foreground font-outfit py-4">{item.studentName}</TableCell>
                      <TableCell className="py-4">
                        <span className="bg-primary/5 text-primary text-xs font-bold px-2.5 py-1 rounded-full border border-primary/20 shadow-sm">
                          {item.className}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm py-4">{item.teacherName}</TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className={cn("font-bold px-2.5 py-1 rounded-full", statusInfo.className)}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="flex justify-end pr-2">
                           <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-all rounded-full group-hover:bg-primary group-hover:text-white">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Visualizar</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
