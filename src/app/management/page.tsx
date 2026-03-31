import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Users, BookOpen, UserCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateClassDialog } from "./components/CreateClassDialog";
import { CreateStudentDialog } from "./components/CreateStudentDialog";
import { LinkTeacherDialog } from "./components/LinkTeacherDialog";
import { CreateTeacherDialog } from "./components/CreateTeacherDialog";

export default async function ManagementPage() {
  const session = await getServerSession(authOptions);

  if (!session || !["OPP", "AQV_OE"].includes(session.user.role)) {
    redirect("/login");
  }

  // @ts-ignore
  const classes = await prisma.class.findMany({
    include: { 
      // @ts-ignore
      _count: { select: { students: true } },
      teachers: true 
    },
    orderBy: { name: 'asc' }
  }) as any[];

  // Fetch all students
  const students = await prisma.student.findMany({
    include: { class: true },
    orderBy: { name: 'asc' },
    take: 100 
  });

  // @ts-ignore
  const teachers = await prisma.user.findMany({
    where: { role: "DOCENTE" },
    include: { classes: true },
    orderBy: { name: "asc" }
  }) as any[];

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <Tabs defaultValue="turmas" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
            <TabsTrigger value="turmas">Turmas</TabsTrigger>
            <TabsTrigger value="alunos">Alunos</TabsTrigger>
            <TabsTrigger value="professores">Professores</TabsTrigger>
          </TabsList>

          <TabsContent value="turmas" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                   <BookOpen className="text-primary" size={24}/> Turmas Ativas
                </h2>
                <CreateClassDialog />
              </div>

              {classes.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 border border-dashed rounded-lg">Nenhuma turma cadastrada.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classes.map((c) => (
                    <div key={c.id} className="p-4 border border-border rounded-lg bg-gray-50 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-lg text-foreground">{c.name}</span>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full font-medium">
                           {c._count.students} alunos
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground border-t pt-2 mt-auto">
                        <div className="font-semibold text-gray-700 mb-1">Docentes:</div>
                        {c.teachers.length > 0 ? (
                           <ul className="list-disc list-inside">
                             {c.teachers.map(t => <li key={t.id}>{t.name}</li>)}
                           </ul>
                        ) : (
                          <span className="text-xs text-orange-600">Nenhum vinculado</span>
                        )}
                      </div>
                      <LinkTeacherDialog classId={c.id} className={c.name} allTeachers={teachers} classTeachers={c.teachers} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="alunos">
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                   <Users className="text-primary" size={24}/> Alunos (Top 100)
                </h2>
                <CreateStudentDialog classes={classes} />
              </div>
              <div className="overflow-auto max-h-[600px] border rounded-lg">
                <table className="w-full text-left text-sm">
                   <thead className="bg-muted sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="p-4 font-semibold text-foreground">Nome do Aluno</th>
                        <th className="p-4 font-semibold text-foreground">Turma Associada</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border">
                     {students.map((s: any) => (
                       <tr key={s.id} className="hover:bg-muted/50 transition-colors bg-white">
                         <td className="p-4 font-medium text-foreground">{s.name}</td>
                         <td className="p-4">
                           <span className="bg-primary/10 text-primary px-2.5 py-1 rounded font-semibold text-xs border border-primary/20">
                             {s.class.name}
                           </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="professores">
             <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                   <UserCircle className="text-primary" size={24}/> Equipe Docente
                </h2>
                <CreateTeacherDialog />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teachers.map(t => (
                  <div key={t.id} className="p-4 border rounded-lg flex flex-col gap-2">
                     <span className="font-bold text-[15px]">{t.name}</span>
                     <span className="text-xs text-muted-foreground">{t.email}</span>
                     <div className="flex flex-wrap gap-1 mt-2 border-t pt-2">
                        {t.classes.length > 0 ? (
                           t.classes.map(c => (
                             <span key={c.id} className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded border">
                               {c.name}
                             </span>
                           ))
                        ) : (
                          <span className="text-xs text-orange-500 font-medium">Sem turmas</span>
                        )}
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
