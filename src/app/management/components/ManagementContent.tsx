"use client";

import { useMemo, useState } from "react";
import { Users, BookOpen, UserCircle, Search, Filter, X } from "lucide-react";
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

  // Pagination States per Tab
  const [classPage, setClassPage] = useState(1);
  const [classPageSize, setClassPageSize] = useState(12);

  const [studentPage, setStudentPage] = useState(1);
  const [studentPageSize, setStudentPageSize] = useState(10);

  const [teacherPage, setTeacherPage] = useState(1);
  const [teacherPageSize, setTeacherPageSize] = useState(12);

  // Filtering Logic: Classes
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

  // Filtering Logic: Students
  const filteredStudents = useMemo(() => {
    return initialStudents.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase());
      const matchClass = studentClassFilter === "all" || s.classId === studentClassFilter;
      return matchSearch && matchClass;
    });
  }, [initialStudents, studentSearch, studentClassFilter]);

  const handleFilterChange = (setter: (val: string) => void, setPage: (val: number) => void) => (val: string | null) => {
    setter(val || "all");
    setPage(1);
  };

  const paginatedStudents = useMemo(() => {
    const start = (studentPage - 1) * studentPageSize;
    return filteredStudents.slice(start, start + studentPageSize);
  }, [filteredStudents, studentPage, studentPageSize]);

  const studentTotalPages = Math.ceil(filteredStudents.length / studentPageSize);

  // Filtering Logic: Teachers
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
    <Tabs defaultValue="turmas" className="w-full">
      <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
        <TabsTrigger value="turmas" className="cursor-pointer">Turmas</TabsTrigger>
        <TabsTrigger value="alunos" className="cursor-pointer">Alunos</TabsTrigger>
        <TabsTrigger value="professores" className="cursor-pointer">Professores</TabsTrigger>
      </TabsList>

      {/* TABS: TURMAS */}
      <TabsContent value="turmas" className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-border p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b pb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                 <BookOpen className="text-primary" size={24}/> Turmas Ativas
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Gerencie as turmas e vínculos docentes.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative group w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Buscar por turma ou professor..." 
                  className="pl-9 bg-zinc-50 border-zinc-200 focus:bg-white rounded-xl h-10 cursor-text"
                  value={classSearch}
                  onChange={(e) => {
                    setClassSearch(e.target.value);
                    setClassPage(1);
                  }}
                />
              </div>
              <CreateClassDialog />
            </div>
          </div>

          {paginatedClasses.length === 0 ? (
            <div className="text-center text-muted-foreground py-16 border border-dashed rounded-xl bg-zinc-50/50">
              <BookOpen size={40} className="mx-auto mb-3 opacity-20" />
              <p className="font-medium">Nenhuma turma encontrada.</p>
              {classSearch && <Button variant="link" onClick={() => {
                setClassSearch("");
                setClassPage(1);
              }} className="mt-2 text-primary">Limpar filtros</Button>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedClasses.map((c: any) => (
                <div key={c.id} className="group p-5 border border-zinc-200 rounded-xl bg-white hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-lg text-zinc-900 group-hover:text-primary transition-colors">{c.name}</span>
                    <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                       {c._count.students} alunos
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground border-t border-zinc-100 pt-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                       <Users size={12}/> Docentes Vinculados
                    </div>
                    {c.teachers.length > 0 ? (
                       <div className="flex flex-wrap gap-1.5">
                         {c.teachers.map((t: any) => (
                           <span key={t.id} className="text-xs bg-zinc-100 text-zinc-700 px-2 py-1 rounded-md font-medium">
                             {t.name.split(' ')[0]}
                           </span>
                         ))}
                       </div>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-bold uppercase bg-amber-50 px-2 py-0.5 rounded">Atenção: Sem docente</span>
                    )}
                  </div>
                  <div className="pt-2">
                    <LinkTeacherDialog 
                      classId={c.id} 
                      className={c.name} 
                      allTeachers={initialTeachers} 
                      classTeachers={c.teachers} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Pagination 
            currentPage={classPage}
            totalPages={classTotalPages}
            onPageChange={setClassPage}
            pageSize={classPageSize}
            onPageSizeChange={(newSize) => {
              setClassPageSize(newSize);
              setClassPage(1);
            }}
            totalItems={filteredClasses.length}
          />
        </div>
      </TabsContent>

      {/* TABS: ALUNOS */}
      <TabsContent value="alunos">
        <div className="bg-white rounded-xl shadow-sm border border-border p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b pb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                 <Users className="text-primary" size={24}/> Listagem de Alunos
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Exibindo registros da unidade.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative group w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Buscar pelo nome do aluno..." 
                  className="pl-9 bg-zinc-50 border-zinc-200 focus:bg-white rounded-xl h-10 cursor-text"
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    setStudentPage(1);
                  }}
                />
              </div>
              
              <Select value={studentClassFilter} onValueChange={(val) => {
                setStudentClassFilter(val || "all");
                setStudentPage(1);
              }}>
                <SelectTrigger className="w-full sm:w-48 bg-zinc-50 border-zinc-200 h-10 rounded-xl cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Filter size={14} className="text-zinc-400" />
                    <SelectValue>
                      {studentClassFilter === "all" ? "Todas as Turmas" : initialClasses.find(c => c.id === studentClassFilter)?.name}
                    </SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer font-medium italic">Todas as Turmas</SelectItem>
                  {initialClasses.map((c: any) => (
                    <SelectItem key={c.id} value={c.id} className="cursor-pointer">{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <CreateBulkStudentsDialog classes={initialClasses} />
                <CreateStudentDialog classes={initialClasses} />
              </div>
            </div>
          </div>

          <div className="overflow-hidden border border-zinc-200 rounded-xl shadow-sm">
            <table className="w-full text-left text-sm">
               <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th className="p-4 font-bold text-zinc-500 uppercase text-[10px] tracking-widest pl-6">Nome Completo do Aluno</th>
                    <th className="p-4 font-bold text-zinc-500 uppercase text-[10px] tracking-widest">Turma / Período</th>
                    <th className="p-4 font-bold text-zinc-500 uppercase text-[10px] tracking-widest text-right pr-6">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-100">
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-12 text-center text-muted-foreground italic">
                        <Search size={32} className="mx-auto mb-2 opacity-10" />
                        Nenhum aluno encontrado para os filtros selecionados.
                      </td>
                    </tr>
                 ) : (
                   paginatedStudents.map((s: any) => (
                    <tr key={s.id} className="hover:bg-zinc-50/50 transition-colors bg-white group">
                      <td className="p-4 pl-6 font-semibold text-zinc-900 group-hover:text-primary transition-colors">{s.name}</td>
                      <td className="p-4">
                        <span className="bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-md font-bold text-[11px] border border-zinc-200 uppercase tracking-tighter">
                          {s.class?.name || "Sem Turma"}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                         <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                            <span className="w-1 h-1 bg-emerald-600 rounded-full animate-pulse"></span>
                            Ativo
                         </div>
                      </td>
                    </tr>
                  ))
                 )}
               </tbody>
            </table>
          </div>

          <Pagination 
            currentPage={studentPage}
            totalPages={studentTotalPages}
            onPageChange={setStudentPage}
            pageSize={studentPageSize}
            onPageSizeChange={(newSize) => {
              setStudentPageSize(newSize);
              setStudentPage(1);
            }}
            totalItems={filteredStudents.length}
          />
        </div>
      </TabsContent>

      {/* TABS: PROFESSORES */}
      <TabsContent value="professores">
         <div className="bg-white rounded-xl shadow-sm border border-border p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b pb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                 <UserCircle className="text-primary" size={24}/> Quadro de Docentes
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Gerencie a alocação de professores.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative group w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Nome ou e-mail..." 
                  className="pl-9 bg-zinc-50 border-zinc-200 focus:bg-white rounded-xl h-10 cursor-text"
                  value={teacherSearch}
                  onChange={(e) => {
                    setTeacherSearch(e.target.value);
                    setTeacherPage(1);
                  }}
                />
              </div>
              
              <Select value={teacherAllocationFilter} onValueChange={(val) => {
                setTeacherAllocationFilter(val || "all");
                setTeacherPage(1);
              }}>
                <SelectTrigger className="w-full sm:w-48 bg-zinc-50 border-zinc-200 h-10 rounded-xl cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Filter size={14} className="text-zinc-400" />
                    <SelectValue>
                      {teacherAllocationFilter === "all" ? "Todos" : 
                       teacherAllocationFilter === "allocated" ? "Com Turmas" : "Sem Turmas"}
                    </SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer font-medium">Todos</SelectItem>
                  <SelectItem value="allocated" className="cursor-pointer">Com Turmas</SelectItem>
                  <SelectItem value="unallocated" className="cursor-pointer font-bold text-amber-600">Sem Turmas</SelectItem>
                </SelectContent>
              </Select>

              <CreateTeacherDialog />
            </div>
          </div>
          
          {paginatedTeachers.length === 0 ? (
             <div className="text-center text-muted-foreground py-16 border border-dashed rounded-xl bg-zinc-50/50">
                <UserCircle size={40} className="mx-auto mb-3 opacity-20" />
                <p className="font-medium">Nenhum professor encontrado.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedTeachers.map((t: any) => (
                <div key={t.id} className="p-5 border border-zinc-200 rounded-xl bg-white hover:border-zinc-300 transition-all flex flex-col gap-3 group">
                   <div className="flex flex-col">
                      <span className="font-bold text-zinc-900 group-hover:text-primary transition-colors">{t.name}</span>
                      <span className="text-[11px] text-zinc-400 font-medium truncate">{t.email}</span>
                   </div>
                   
                   <div className="flex flex-wrap gap-1.5 mt-2 border-t border-zinc-50 pt-4">
                      {t.classes.length > 0 ? (
                         t.classes.map((c: any) => (
                           <span key={c.id} className="bg-zinc-100 text-zinc-600 text-[9px] px-2 py-0.5 rounded-full border border-zinc-200 uppercase font-bold tracking-tight">
                             {c.name}
                           </span>
                         ))
                      ) : (
                        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-amber-100 italic">
                           Sem Turmas Vinculadas
                        </div>
                      )}
                   </div>
                </div>
              ))}
            </div>
          )}

          <Pagination 
            currentPage={teacherPage}
            totalPages={teacherTotalPages}
            onPageChange={setTeacherPage}
            pageSize={teacherPageSize}
            onPageSizeChange={(newSize) => {
              setTeacherPageSize(newSize);
              setTeacherPage(1);
            }}
            totalItems={filteredTeachers.length}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
