"use client";

import { useMemo, useState } from "react";
import { Users, BookOpen, UserCircle, Search, Filter, X, Plus, Sparkles, LayoutGrid, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CreateClassDialog } from "./CreateClassDialog";
import { CreateStudentDialog } from "./CreateStudentDialog";
import { CreateBulkStudentsDialog } from "./CreateBulkStudentsDialog";
import { LinkTeacherDialog } from "./LinkTeacherDialog";
import { CreateTeacherDialog } from "./CreateTeacherDialog";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";
import { motion, AnimatePresence } from "framer-motion";

interface ManagementContentProps {
  initialClasses: any[];
  initialStudents: any[];
  initialTeachers: any[];
}

export function ManagementContent({ 
  initialClasses, 
  initialStudents, 
  initialTeachers 
}: ManagementContentProps) {
  // Filter States
  const [classSearch, setClassSearch] = useState("");
  
  const [studentSearch, setStudentSearch] = useState("");
  const [studentClassFilter, setStudentClassFilter] = useState("all");
  
  const [teacherSearch, setTeacherSearch] = useState("");
  const [teacherAllocationFilter, setTeacherAllocationFilter] = useState("all");
  
  const [activeTab, setActiveTab] = useState("turmas");

  // Pagination States per Tab
  const [classPage, setClassPage] = useState(1);
  const [classPageSize, setClassPageSize] = useState(12);

  const [studentPage, setStudentPage] = useState(1);
  const [studentPageSize, setStudentPageSize] = useState(10);

  const [teacherPage, setTeacherPage] = useState(1);
  const [teacherPageSize, setTeacherPageSize] = useState(12);

  const filteredClasses = useMemo(() => {
    return initialClasses.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(classSearch.toLowerCase());
      const matchTeacher = c.teachers.some((t: any) => t.name.toLowerCase().includes(classSearch.toLowerCase()));
      return matchSearch || matchTeacher;
    });
  }, [initialClasses, classSearch]);

  const paginatedClasses = useMemo(() => {
    const start = (classPage - 1) * classPageSize;
    return filteredClasses.slice(start, start + classPageSize);
  }, [filteredClasses, classPage, classPageSize]);

  const classTotalPages = Math.ceil(filteredClasses.length / classPageSize);

  const filteredStudents = useMemo(() => {
    return initialStudents.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase());
      const matchClass = studentClassFilter === "all" || s.classId === studentClassFilter;
      return matchSearch && matchClass;
    });
  }, [initialStudents, studentSearch, studentClassFilter]);

  const paginatedStudents = useMemo(() => {
    const start = (studentPage - 1) * studentPageSize;
    return filteredStudents.slice(start, start + studentPageSize);
  }, [filteredStudents, studentPage, studentPageSize]);

  const studentTotalPages = Math.ceil(filteredStudents.length / studentPageSize);

  const filteredTeachers = useMemo(() => {
    return initialTeachers.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(teacherSearch.toLowerCase()) || 
                          t.email.toLowerCase().includes(teacherSearch.toLowerCase());
      
      const isUnallocated = t.classes.length === 0;
      const matchAllocation = teacherAllocationFilter === "all" || 
                              (teacherAllocationFilter === "unallocated" && isUnallocated) ||
                              (teacherAllocationFilter === "allocated" && !isUnallocated);
                              
      return matchSearch && matchAllocation;
    });
  }, [initialTeachers, teacherSearch, teacherAllocationFilter]);

  const paginatedTeachers = useMemo(() => {
    const start = (teacherPage - 1) * teacherPageSize;
    return filteredTeachers.slice(start, start + teacherPageSize);
  }, [filteredTeachers, teacherPage, teacherPageSize]);

  const teacherTotalPages = Math.ceil(filteredTeachers.length / teacherPageSize);

  return (
    <Tabs defaultValue="turmas" value={activeTab} onValueChange={setActiveTab} className="w-full animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
        <TabsList className="grid w-full md:w-[640px] grid-cols-3 bg-muted/60 p-2 rounded-2xl border border-white/10 backdrop-blur-2xl relative shadow-2xl overflow-visible">
          <TabsTrigger value="turmas" className="relative cursor-pointer rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2.5 h-11 data-[state=active]:text-white text-muted-foreground hover:text-foreground hover:bg-white/5 bg-transparent! outline-none border-none ring-0 focus-visible:ring-0">
            <BookOpen size={16} className="relative z-20 transition-transform group-active:scale-90" />
            <span className="relative z-20">Turmas Ativas</span>
            {activeTab === "turmas" && (
              <motion.div 
                layoutId="active-tab"
                className="absolute inset-0 bg-primary rounded-xl shadow-[0_8px_20px_rgba(237,28,36,0.4)] z-10"
                transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              />
            )}
          </TabsTrigger>
          <TabsTrigger value="alunos" className="relative cursor-pointer rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2.5 h-11 data-[state=active]:text-white text-muted-foreground hover:text-foreground hover:bg-white/5 bg-transparent! outline-none border-none ring-0 focus-visible:ring-0">
            <Users size={16} className="relative z-20 transition-transform group-active:scale-90" />
            <span className="relative z-20">Quadro Alunos</span>
            {activeTab === "alunos" && (
              <motion.div 
                layoutId="active-tab"
                className="absolute inset-0 bg-primary rounded-xl shadow-[0_8px_20px_rgba(237,28,36,0.4)] z-10"
                transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              />
            )}
          </TabsTrigger>
          <TabsTrigger value="professores" className="relative cursor-pointer rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2.5 h-11 data-[state=active]:text-white text-muted-foreground hover:text-foreground hover:bg-white/5 bg-transparent! outline-none border-none ring-0 focus-visible:ring-0">
            <UserCircle size={16} className="relative z-20 transition-transform group-active:scale-90" />
            <span className="relative z-20">Púlpito Docente</span>
            {activeTab === "professores" && (
              <motion.div 
                layoutId="active-tab"
                className="absolute inset-0 bg-primary rounded-xl shadow-[0_8px_20px_rgba(237,28,36,0.4)] z-10"
                transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              />
            )}
          </TabsTrigger>
        </TabsList>
        
        <div className="flex items-center gap-3 bg-primary/5 px-6 py-3 rounded-full border border-primary/10 text-[10px] font-black text-primary uppercase tracking-widest animate-float">
           <Sparkles size={14}/> Gestão de Alta Performance
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* TABS: TURMAS */}
        <TabsContent key="turmas" value="turmas" className="space-y-8 focus-visible:ring-0">
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 10 }}
            className="glass-card rounded-[2.5rem] p-10 shadow-2xl shadow-primary/5"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 pb-10 border-b border-white/10">
              <div className="space-y-1">
                <h2 className="text-3xl font-heading font-black text-foreground tracking-tightest leading-none text-glow flex items-center gap-4">
                   <div className="p-3 bg-primary/10 rounded-2xl">
                      <BookOpen className="text-primary" size={24}/>
                   </div>
                   Turmas da Unidade
                </h2>
                <p className="text-sm text-muted-foreground font-bold tracking-tight pl-16 opacity-60 italic">Visualize e gerencie os vínculos docentes por classe.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative group w-full sm:w-80">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-all group-hover:scale-110" />
                  <Input 
                    placeholder="Busca rápida de turmas..." 
                    className="pl-12 h-12 bg-background/50 border-white/10 focus:bg-background rounded-2xl font-bold text-base transition-all focus:ring-[8px]"
                    value={classSearch}
                    onChange={(e) => { setClassSearch(e.target.value); setClassPage(1); }}
                  />
                </div>
                <CreateClassDialog />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedClasses.map((c: any) => (
                <div key={c.id} className="group glass-card p-6 rounded-[2.2rem] border-white/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col gap-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 blur-2xl rounded-full" />
                  
                  <div className="flex justify-between items-start relative z-10">
                    <span className="font-heading font-black text-2xl text-foreground group-hover:text-primary transition-colors tracking-tight leading-none drop-shadow-sm">{c.name}</span>
                    <span className="text-[9px] font-black bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/10 shadow-sm uppercase tracking-widest whitespace-nowrap">
                       {c._count.students} Alunos
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground pt-4 relative z-10">
                    <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] mb-4 italic">
                       <Users size={12}/> Equipe Docente
                    </div>
                    {c.teachers.length > 0 ? (
                       <div className="flex flex-wrap gap-2">
                         {c.teachers.map((t: any) => (
                           <span key={t.id} className="text-[10px] font-black bg-white/[0.03] text-foreground/80 px-3 py-1.5 rounded-xl border border-white/5 shadow-sm transition-all hover:bg-primary/10 hover:text-primary hover:border-primary/10">
                             {t.name.split(' ')[0]}
                           </span>
                         ))}
                       </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[9px] font-black text-amber-500/60 uppercase tracking-widest italic animate-pulse">
                         Atenção: Nenhuma alocação realizada
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-auto">
                    <LinkTeacherDialog 
                      classId={c.id} 
                      className={c.name} 
                      allTeachers={initialTeachers} 
                      classTeachers={c.teachers} 
                    />
                  </div>
                </div>
              ))}
              
              {paginatedClasses.length === 0 && (
                <div className="col-span-full py-20 text-center glass-card rounded-[2.5rem] border-white/5 border-dashed">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="font-black text-muted-foreground/40 text-xs uppercase tracking-widest">Nenhuma turma registrada no sistema.</p>
                </div>
              )}
            </div>

            <div className="mt-12 pt-10 border-t border-white/10">
              <Pagination 
                currentPage={classPage}
                totalPages={classTotalPages}
                onPageChange={setClassPage}
                pageSize={classPageSize}
                onPageSizeChange={(newSize) => { setClassPageSize(newSize); setClassPage(1); }}
                totalItems={filteredClasses.length}
              />
            </div>
          </motion.div>
        </TabsContent>

        {/* TABS: ALUNOS */}
        <TabsContent key="alunos" value="alunos" className="focus-visible:ring-0">
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 10 }}
            className="glass-card rounded-[2.5rem] p-10 shadow-2xl shadow-primary/5"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 pb-10 border-b border-white/10">
               <div className="space-y-1">
                <h2 className="text-3xl font-heading font-black text-foreground tracking-tightest leading-none text-glow flex items-center gap-4">
                   <div className="p-3 bg-primary/10 rounded-2xl">
                      <Users className="text-primary" size={24}/>
                   </div>
                   Matrículas Ativas
                </h2>
                <p className="text-sm text-muted-foreground font-bold tracking-tight pl-16 opacity-60 italic">Gestão completa da base de alunos matriculados.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative group w-full sm:w-80">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary" />
                  <Input 
                    placeholder="Nome do aluno..." 
                    className="pl-12 h-12 bg-background/50 border-white/10 focus:bg-background rounded-2xl font-bold text-base"
                    value={studentSearch}
                    onChange={(e) => { setStudentSearch(e.target.value); setStudentPage(1); }}
                  />
                </div>
                
                <Select value={studentClassFilter} onValueChange={(val) => { setStudentClassFilter(val || "all"); setStudentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-56 glass-input h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest border-white/10">
                    <div className="flex items-center gap-3">
                      <Filter size={14} className="text-primary" />
                      <SelectValue>
                        {studentClassFilter === "all" ? "Todas as Turmas" : initialClasses.find(c => c.id === studentClassFilter)?.name}
                      </SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="glass-card rounded-2xl border-white/10">
                    <SelectItem value="all" className="font-black italic">Todas as Turmas</SelectItem>
                    {initialClasses.map((c: any) => (
                      <SelectItem key={c.id} value={c.id} className="font-bold">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-3">
                  <CreateBulkStudentsDialog classes={initialClasses} />
                  <CreateStudentDialog classes={initialClasses} />
                </div>
              </div>
            </div>

            <div className="overflow-hidden bg-background/20 rounded-[2rem] border border-white/5">
              <table className="w-full text-left text-sm">
                 <thead className="bg-muted/10 border-b border-white/5">
                    <tr>
                      <th className="p-6 font-black text-muted-foreground/40 uppercase text-[10px] tracking-widest pl-10">Identificação Acadêmica</th>
                      <th className="p-6 font-black text-muted-foreground/40 uppercase text-[10px] tracking-widest">Alocação de Período</th>
                      <th className="p-6 font-black text-muted-foreground/40 uppercase text-[10px] tracking-widest text-right pr-10">Monitoramento</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {paginatedStudents.map((s: any) => (
                      <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-6 pl-10">
                           <div className="font-heading font-black text-xl text-foreground group-hover:text-primary transition-all tracking-tight leading-none drop-shadow-sm">{s.name}</div>
                        </td>
                        <td className="p-6">
                          <span className="bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full font-black text-[10px] border border-white/5 uppercase tracking-widest">
                            {s.class?.name || "Sem Turma Registrada"}
                          </span>
                        </td>
                        <td className="p-6 pr-10 text-right">
                           <div className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/10 shadow-sm animate-pulse">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                              Vínculo Ativo
                           </div>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
              {paginatedStudents.length === 0 && (
                <div className="py-20 text-center font-black text-muted-foreground/40 text-xs uppercase tracking-widest italic">Nenhum aluno encontrado para os critérios.</div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
               <Pagination 
                currentPage={studentPage}
                totalPages={studentTotalPages}
                onPageChange={setStudentPage}
                pageSize={studentPageSize}
                onPageSizeChange={(newSize) => { setStudentPageSize(newSize); setStudentPage(1); }}
                totalItems={filteredStudents.length}
              />
            </div>
          </motion.div>
        </TabsContent>

        {/* TABS: PROFESSORES */}
        <TabsContent key="professores" value="professores" className="focus-visible:ring-0">
           <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 10 }}
            className="glass-card rounded-[2.5rem] p-10 shadow-2xl shadow-primary/5"
           >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 pb-10 border-b border-white/10">
               <div className="space-y-1">
                <h2 className="text-3xl font-heading font-black text-foreground tracking-tightest leading-none text-glow flex items-center gap-4">
                   <div className="p-3 bg-primary/10 rounded-2xl">
                      <UserCircle className="text-primary" size={24}/>
                   </div>
                   Púlpito de Docentes
                </h2>
                <p className="text-sm text-muted-foreground font-bold tracking-tight pl-16 opacity-60 italic">Corpo docente vinculado à gestão pedagógica desta unidade.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative group w-full sm:w-80">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-all" />
                  <Input 
                    placeholder="Nome do docente..." 
                    className="pl-12 h-12 bg-background/50 border-white/10 focus:bg-background rounded-2xl font-bold text-base transition-all"
                    value={teacherSearch}
                    onChange={(e) => { setTeacherSearch(e.target.value); setTeacherPage(1); }}
                  />
                </div>
                
                <Select value={teacherAllocationFilter} onValueChange={(val) => { setTeacherAllocationFilter(val || "all"); setTeacherPage(1); }}>
                  <SelectTrigger className="w-full sm:w-56 glass-input h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest border-white/10">
                    <div className="flex items-center gap-3">
                      <Filter size={14} className="text-primary" />
                      <SelectValue>
                        {teacherAllocationFilter === "all" ? "Todos os Docentes" : teacherAllocationFilter === "allocated" ? "Com Alocações" : "Ociosos"}
                      </SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="glass-card rounded-2xl border-white/10">
                    <SelectItem value="all" className="font-black">Todos os Docentes</SelectItem>
                    <SelectItem value="allocated" className="font-bold">Com Alocações</SelectItem>
                    <SelectItem value="unallocated" className="font-black text-primary italic">Ociosos (Sem Turmas)</SelectItem>
                  </SelectContent>
                </Select>

                <CreateTeacherDialog />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedTeachers.map((t: any) => (
                <div key={t.id} className="p-8 glass-card rounded-[2.2rem] border-white/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col gap-6 relative group overflow-hidden">
                   <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full" />
                   
                   <div className="flex flex-col relative z-10">
                      <span className="font-heading font-black text-xl text-foreground group-hover:text-primary transition-all leading-none">{t.name}</span>
                      <span className="text-[11px] text-muted-foreground font-black italic tracking-tight opacity-40 mt-1 truncate">{t.email}</span>
                   </div>
                   
                   <div className="pt-6 relative z-10 border-t border-white/5">
                      <div className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] mb-4 italic">Alocações Oficiais</div>
                      <div className="flex flex-wrap gap-2">
                        {t.classes.length > 0 ? (
                           t.classes.map((c: any) => (
                             <span key={c.id} className="bg-muted text-foreground/80 text-[10px] px-3 py-1.5 rounded-full border border-white/5 uppercase font-black tracking-widest shadow-sm hover:bg-primary/10 hover:text-primary hover:border-primary/10 transition-all">
                               {c.name}
                             </span>
                           ))
                        ) : (
                          <div className="w-full flex items-center gap-2 p-3 rounded-2xl bg-primary/5 border border-primary/10 text-[9px] font-black text-primary/60 uppercase tracking-widest italic animate-pulse">
                             Aguardando Atribuição de Carga
                          </div>
                        )}
                      </div>
                   </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-10 border-t border-white/10">
               <Pagination 
                currentPage={teacherPage}
                totalPages={teacherTotalPages}
                onPageChange={setTeacherPage}
                pageSize={teacherPageSize}
                onPageSizeChange={(newSize) => { setTeacherPageSize(newSize); setTeacherPage(1); }}
                totalItems={filteredTeachers.length}
              />
            </div>
          </motion.div>
        </TabsContent>
      </AnimatePresence>
    </Tabs>
  );
}
