import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Settings, Sparkles } from "lucide-react";
import Link from "next/link";
import { NavIndicator } from "./NavIndicator";
import { UserNav } from "./UserNav";
import { ThemeToggle } from "./ThemeToggle";

export default async function Header() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 lg:px-10 py-4 pointer-events-none no-print">
      <div className="mx-auto w-full max-w-7xl glass-card rounded-3xl h-20 flex items-center justify-between px-8 pointer-events-auto border-2 border-border/50 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/5 group transition-all">
        
        {/* Branding Section */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-4 transition-transform active:scale-95">
            <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(237,28,36,0.3)] border border-primary/20 group-hover:animate-float">
              <span className="text-white font-black text-2xl select-none leading-none">S</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-xl font-heading font-bold tracking-tightest leading-none text-foreground text-glow uppercase-none">SENAI MARIANO</h1>
              <div className="flex items-center gap-1.5 mt-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                 <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider leading-none">Edulink System</p>
              </div>
            </div>
          </Link>
          
          <div className="hidden lg:block h-8 w-px bg-border/40" />
          
          <div className="hidden lg:block">
            <NavIndicator />
          </div>
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[11px] font-bold text-primary/80 uppercase tracking-wider animate-float italic">
             <Sparkles size={12}/> Vibe-High Performance
          </div>
          
          <div className="flex items-center bg-muted/30 p-1 rounded-2xl border border-border/20">
            <ThemeToggle />
            <div className="w-px h-6 bg-border/40 mx-1" />
            <UserNav user={session.user} />
          </div>
        </div>
      </div>
      
      {/* Visual Bottom Shadow/Glow */}
      <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm" />
    </header>
  );
}
