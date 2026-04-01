"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const pageMap: Record<string, string> = {
  "/dashboard/docente": "Painel do Docente",
  "/dashboard/pedagogico": "Fila de Atendimento",
  "/management": "Gestão de Dados",
  "/fiaa/nova": "Nova FIAA",
};

export function NavIndicator() {
  const pathname = usePathname();
  
  // Handle dynamic routes like /fiaa/[id]
  let currentPage = pageMap[pathname];
  if (!currentPage && pathname.startsWith("/fiaa/")) {
    currentPage = "Detalhes da FIAA";
  }

  return (
    <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
      <Link 
        href="/" 
        className={cn(
          "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" || pathname.includes("dashboard") 
            ? "text-primary" 
            : "text-muted-foreground"
        )}
      >
        <Home size={16} />
        <span className="hidden lg:inline">Início</span>
      </Link>

      {currentPage && (
        <>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-sm font-semibold text-gray-900 whitespace-nowrap bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200 shadow-sm">
            {currentPage}
          </span>
        </>
      )}
    </div>
  );
}
