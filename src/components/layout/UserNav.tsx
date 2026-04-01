"use client";

import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function UserNav({ user }: { user: { name?: string | null; email?: string | null; role?: string } }) {
  const initials = user?.name?.substring(0, 2).toUpperCase() || "US";
  const roleDisplay = user?.role === "DOCENTE" ? "Docente" : 
                      user?.role === "OPP" ? "Orientador" : 
                      user?.role === "AQV_OE" ? "Qualidade de Vida" : "Usuário";

  return (
    <DropdownMenu>
      {/* 
        No Base UI, o Trigger já renderiza um botão por padrão e NÃO suporta 'asChild'. 
        Removemos o botão interno para evitar erro de hidratação (botão dentro de botão).
      */}
      <DropdownMenuTrigger 
        className="flex items-center gap-3 p-1 rounded-full hover:bg-muted/50 transition-all outline-none group border border-transparent hover:border-border select-none cursor-pointer"
      >
        <Avatar className="h-9 w-9 border border-border shadow-sm group-hover:scale-105 transition-transform pointer-events-none">
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="hidden md:flex flex-col items-start pr-2 pointer-events-none text-left">
          <span className="text-sm font-bold text-foreground leading-tight">{user?.name}</span>
          <span className="text-[10px] text-muted-foreground leading-tight">{user?.email}</span>
        </div>
        <ChevronDown size={14} className="text-muted-foreground mr-1 group-data-[state=open]:rotate-180 transition-transform hidden sm:block pointer-events-none" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 mt-1" align="end" sideOffset={8}>
        {/* Base UI exige que DropdownMenuLabel (GroupLabel) esteja dentro de um Group */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal p-4 bg-muted/20">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-bold leading-none font-outfit">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground font-inter">{user?.email}</p>
              <Badge variant="secondary" className="w-fit text-[9px] uppercase tracking-wider font-bold py-0.5 bg-primary/5 text-primary border-primary/20">
                {roleDisplay}
              </Badge>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup className="p-1">
          {/* 
             Não usamos 'asChild' no MenuItem do Base UI pois ele não suporta. 
             Colocamos o Link como filho e o MenuItem cuidará da navegação ao capturar o clique.
          */}
          <DropdownMenuItem className="cursor-pointer rounded-md py-2.5 p-0">
            <Link href="/perfil" className="flex items-center w-full px-2 py-1">
              <User className="mr-3 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Meu Perfil</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem 
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5 rounded-md py-2.5"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span className="font-bold">Sair do Sistema</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
