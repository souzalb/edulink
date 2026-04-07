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
import { Eye as EyeIcon, Search as SearchIcon, Filter as FilterIcon, Calendar as CalendarIcon, X as XIcon, CheckCircle2 as CheckIcon, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Pagination } from "./Pagination";
import { motion, AnimatePresence } from "framer-motion";

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
  const [statusFilter, setStatusFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Get unique classes for the filter
  const uniqueClasses = useMemo(() => {
    const classes = Array.from(new Set(items.map((item) => item.className)));
    return classes.sort();
  }, [items]);

  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesClass = !classFilter || item.className === classFilter;

    let matchesDate = true;
    const itemDateStr = format(new Date(item.createdAt), "yyyy-MM-dd");

    if (startDate && itemDateStr < startDate) matchesDate = false;
    if (endDate && matchesDate && itemDateStr > endDate) matchesDate = false;

    return matchesSearch && matchesStatus && matchesClass && matchesDate;
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const handleFilterChange = (setter: (val: string) => void) => (val: string | null) => {
    setter(val || "");
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setClassFilter("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "DRAFT":
        return { label: "Rascunho", className: "bg-muted/50 text-muted-foreground border-border/20" };
      case "PENDING_OPP":
        return { label: "Ag. Orientação", className: "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]" };
      case "PENDING_TEACHER":
        return { label: "Retornado", className: "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]" };
      case "PENDING_GUARDIAN":
        return { label: "Ag. Responsável", className: "bg-purple-500/10 text-purple-500 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]" };
      case "CONCLUDED":
        return { label: "Concluído", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" };
      default:
        return { label: status, className: "" };
    }
  };

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "ALL" || classFilter !== "ALL" || startDate !== "" || endDate !== "";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* FILTER STAGE */}
      <div className="bg-muted/30 p-3 rounded-3xl border border-border transition-all shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 items-end">
          <FilterItem label="Busca Ativa" icon={<SearchIcon size={12}/>}>
            <div className="relative">
               <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                 placeholder="Aluno ou Docente..." 
                 className="pl-12 h-14 bg-card border border-border rounded-xl font-bold shadow-sm focus:ring-primary/20"
                 value={searchTerm}
                 onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
               />
            </div>
          </FilterItem>

          <FilterItem label="Turma" icon={<FilterIcon size={12}/>}>
            <Select value={classFilter} onValueChange={handleFilterChange(setClassFilter)}>
                <SelectTrigger className="h-14 bg-card border border-border rounded-xl font-bold shadow-sm">
                  <SelectValue placeholder="Todas as Turmas" />
                </SelectTrigger>
                <SelectContent className="glass-card rounded-2xl border-white/10 p-2">
                  <SelectItem value="" className="rounded-xl font-bold">Todas as Turmas</SelectItem>
                  {uniqueClasses.map((c) => (
                    <SelectItem key={c} value={c} className="rounded-xl font-bold">{c}</SelectItem>
                  ))}
                </SelectContent>
            </Select>
          </FilterItem>

          <FilterItem label="Status" icon={<CheckIcon size={12}/>}>
            <Select value={statusFilter} onValueChange={handleFilterChange(setStatusFilter)}>
              <SelectTrigger className="h-14 bg-card border border-border rounded-xl font-bold shadow-sm">
                <SelectValue placeholder="Todos os Status" />
              </SelectTrigger>
              <SelectContent className="glass-card rounded-2xl border-white/10 p-2">
                <SelectItem value="" className="rounded-xl font-bold">Todos os Status</SelectItem>
                <SelectItem value="DRAFT" className="rounded-xl font-bold">Rascunho</SelectItem>
                <SelectItem value="PENDING_OPP" className="rounded-xl font-bold">Aguardando Orientação</SelectItem>
                <SelectItem value="PENDING_TEACHER" className="rounded-xl font-bold">Retornado</SelectItem>
                <SelectItem value="PENDING_GUARDIAN" className="rounded-xl font-bold">Aguardando Responsável</SelectItem>
                <SelectItem value="CONCLUDED" className="rounded-xl font-bold">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          <FilterItem label="Início" icon={<CalendarIcon size={12}/>}>
            <Input 
              type="date"
              className="h-14 bg-card border border-border rounded-xl font-bold shadow-sm focus:ring-primary/20"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
            />
          </FilterItem>

          <FilterItem label="Fim" icon={<CalendarIcon size={12}/>}>
            <Input 
              type="date"
              className="h-14 bg-card border border-border rounded-xl font-bold shadow-sm focus:ring-primary/20"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
            />
          </FilterItem>

          <div className="p-2 w-full h-full flex items-end">
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="h-14 w-full gap-2 text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-xl transition-all cursor-pointer font-bold text-[11px] uppercase tracking-wider"
              >
                <XIcon size={16} /> Limpar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* TABLE STAGE */}
      <div className="bg-background/20 rounded-3xl border border-border overflow-hidden transition-all duration-700 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted border-b-2 border-border/80">
              <TableRow className="hover:bg-transparent border-none h-14">
                <TableHead className="w-[140px] pl-10 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">Data Registro</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">Aluno em Destaque</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">Turma / Período</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">Docente Requerente</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">Status Fluxo</TableHead>
                <TableHead className="text-right pr-10 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">Monitorar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {paginatedItems.map((item, index) => {
                  const statusInfo = getStatusInfo(item.status);
                  return (
                    <motion.tr 
                      key={item.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-muted/30 transition-all cursor-pointer border-b border-border/40 h-16 relative"
                      onClick={() => router.push(`/fiaa/${item.id}`)}
                    >
                      <TableCell className="pl-10 font-medium text-[13px] text-muted-foreground/90 relative">
                        {/* Left Shine Decoration on Hover */}
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500 rounded-r-full" />
                        {format(new Date(item.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="font-heading font-bold text-foreground group-hover:text-primary transition-all text-[15px] tracking-tight">
                        {item.studentName}
                      </TableCell>
                      <TableCell>
                        <span className="bg-primary/5 text-primary text-[11px] font-bold px-3 py-1 rounded-full border border-primary/10 shadow-sm uppercase tracking-wider">
                          {item.className}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-[13px] font-medium opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.teacherName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider shadow-sm border-none whitespace-nowrap", statusInfo.className)}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-10">
                        <div className="flex justify-end pr-2 group-hover:translate-x-1 transition-transform">
                           <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                              <ChevronRight size={18} />
                           </div>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              
              {paginatedItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center text-muted-foreground/60 font-black italic tracking-widest text-xs uppercase">
                    Nenhum dossiê pedagógico encontrado para os filtros ativos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-6 border-t border-white/5">
           <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={(newSize) => { setPageSize(newSize); setCurrentPage(1); }}
            totalItems={filteredItems.length}
          />
        </div>
      </div>
    </div>
  );
}

function FilterItem({ label, icon, children }: { label: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 p-2 group">
       <label className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest flex items-center gap-2 pl-2 group-hover:text-primary/60 transition-colors">
          {icon} {label}
       </label>
       {children}
    </div>
  );
}
