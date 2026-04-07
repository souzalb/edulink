import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FiaaDataTable } from "@/components/ui/FiaaDataTable";
import Header from "@/components/layout/Header";
import { Settings, Sparkles, Activity, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default async function PedagogicoDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !["OPP", "AQV_OE"].includes(session.user.role)) {
    return null;
  }

  // Role-based visibility filtering
  const userRole = session.user.role;
  const referralFilter = userRole === "AQV_OE" 
    ? ["AQV", "OE"] 
    : ["OPP", "COORD", "CT", "CAP"];

  // Fetch FIAAs for the queue based on the user's role
  const fiasData = await prisma.fIAA.findMany({
    where: {
      status: { 
        notIn: ["DRAFT", "CONCLUDED", "ARCHIVED"] as any 
      },
      referral: { in: referralFilter as any },
    },
    include: {
      student: { include: { class: true } },
      teacher: true,
    },
    orderBy: { createdAt: "asc" },
  }) as any;

  const formattedFIAAs = fiasData.map((f: any) => ({
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
             <div className="flex items-center gap-3 px-4 py-2 rounded-full glass-card w-fit text-[10px] font-black tracking-widest text-primary uppercase animate-float">
                <Activity size={14} className="text-primary"/> Monitoramento Ativo
             </div>
              <div className="space-y-1">
                <h1 className="text-3xl lg:text-4xl font-heading font-black text-foreground tracking-tight leading-none drop-shadow-sm uppercase-none pl-1">Fila de Gestão</h1>
                <p className="text-sm text-muted-foreground font-bold tracking-tight pl-1.5 italic opacity-60 max-w-lg">Análise e acompanhamento do fluxo pedagógico institucional.</p>
              </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col items-end border-r border-border/40 pr-6 py-2">
                <span className="text-2xl font-black text-foreground leading-none">{formattedFIAAs.length}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pendentes na Fila</span>
             </div>
             <Link 
                href="/management" 
                className="group relative flex items-center gap-3 glass-card px-8 py-4 rounded-2xl text-sm font-black text-foreground hover:text-primary transition-all shadow-xl shadow-primary/5 active:scale-95"
              >
                <div className="p-1.5 bg-primary/10 rounded-lg group-hover:rotate-90 transition-transform duration-500">
                   <Settings size={18} className="text-primary" />
                </div>
                Portal de Configurações
              </Link>
          </div>
        </div>

        {/* MAIN STAGE */}
        <div className="glass-card rounded-[2.5rem] p-4 lg:p-8 shadow-2xl shadow-primary/5 animate-in fade-in slide-in-from-bottom-5 duration-700">
           <div className="mb-8 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-primary rounded-full" />
                 <h2 className="text-xl font-heading font-black text-foreground tracking-tight uppercase-none">Listagem em Tempo Real</h2>
              </div>
              <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Live Updates</span>
              </div>
           </div>
           <FiaaDataTable items={formattedFIAAs} />
        </div>
      </main>
    </div>
  );
}
