import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FilePlus2, Sparkles, LayoutDashboard, History } from "lucide-react";
import Header from "@/components/layout/Header";
import { FiaaDataTable } from "@/components/ui/FiaaDataTable";

export default async function DocenteDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DOCENTE") {
    return null;
  }

  // Find FIAAs created by this teacher
  const fias = await prisma.fIAA.findMany({
    where: { teacherId: session.user.id },
    include: { 
      student: { include: { class: true } },
      teacher: true
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedFIAAs = fias.map((f) => ({
    id: f.id,
    studentName: f.student.name,
    className: f.student.class.name,
    teacherName: f.teacher.name,
    createdAt: f.createdAt,
    status: f.status,
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Header />

      <main className="flex-1 w-full mx-auto px-4 sm:px-8 lg:px-10 py-12 relative z-10">
        
        {/* DASHBOARD HEADER */}
        <div className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="space-y-4">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card w-fit text-[11px] font-bold tracking-wider text-primary uppercase animate-float">
                 <LayoutDashboard size={14} className="text-primary"/> Painel do Docente
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-heading font-extrabold text-foreground tracking-tight drop-shadow-sm">Suas FIAAs</h1>
                <p className="text-base text-muted-foreground font-medium tracking-tight pl-1 opacity-70">Histórico de acompanhamentos pedagógicos realizados por você.</p>
              </div>
          </div>

          <Link
            href="/fiaa/nova"
            className="flex items-center gap-3 bg-primary hover:bg-primary/95 text-white font-bold px-7 py-3.5 rounded-2xl shadow-[0_15px_30px_rgba(237,28,36,0.2)] transition-all active:scale-[0.98] cursor-pointer text-base group"
          >
            <div className="p-1 bg-white/20 rounded-lg group-hover:rotate-180 transition-transform duration-500">
               <FilePlus2 size={20} />
            </div>
            Nova FIAA
          </Link>
        </div>

        {/* MAIN STAGE */}
        <div className="glass-card rounded-3xl p-4 lg:p-8 shadow-2xl shadow-primary/5 animate-in fade-in slide-in-from-bottom-5 duration-700 overflow-hidden">
           <div className="mb-8 flex items-center justify-between px-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-xl">
                    <History size={20} className="text-primary" />
                 </div>
                 <h2 className="text-xl font-heading font-black text-foreground tracking-tight uppercase-none">Registros Recentes</h2>
              </div>
              <div className="hidden sm:flex items-center gap-3 bg-muted/30 px-5 py-2.5 rounded-2xl border border-border/40 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                 <Sparkles size={12}/> Vibe-High Performance
              </div>
           </div>
           
           <FiaaDataTable items={formattedFIAAs} />
        </div>
      </main>
    </div>
  );
}
