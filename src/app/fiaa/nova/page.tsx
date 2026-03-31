import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import { FiaaForm } from "./FiaaForm";

export default async function NovaFiaaPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DOCENTE") {
    redirect("/login");
  }

  // Fetch classes related to this teacher, include students
  const classes = await prisma.class.findMany({
    where: {
      teachers: { some: { id: session.user.id } }
    },
    include: { 
      students: { orderBy: { name: "asc" } } 
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-muted/40 pb-12">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard/docente" className="text-muted-foreground hover:text-foreground flex items-center gap-2 font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-border">
            <ArrowLeft size={18} /> Voltar ao Painel
          </Link>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-border">
          <div className="mb-8 pb-6 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Ficha de Acompanhamento de Aluno</h2>
            <p className="text-muted-foreground">
              Selecione a turma e o aluno em dificuldade. Destaque os pontos observados e as providências sugeridas.
            </p>
          </div>

          <FiaaForm classes={classes as any} />
        </div>
      </main>
    </div>
  );
}
