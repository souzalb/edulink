"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email acadêmico ou senha incorretos.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-background selection:bg-primary/30 relative overflow-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[100px] rounded-full" />
      </div>

      {/* LADO VISUAL (ESQUERDO) - O PALCO */}
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-between p-16 z-10 transition-all">
        {/* Background Overlay with Texture */}
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale-[0.3] brightness-[0.75] transition-all hover:scale-105 duration-10000"
          style={{ backgroundImage: "url('/login-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/60 to-primary/20 backdrop-brightness-50" />
        
        {/* Top Branding Section */}
        <div className="relative z-20 flex items-center gap-4">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(237,28,36,0.4)] border border-primary/40 animate-float">
            <span className="text-white font-bold text-3xl select-none leading-none">S</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-2xl leading-none tracking-tighter text-glow">SENAI</span>
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] leading-none mt-1.5 font-heading">Mariano Ferraz</span>
          </div>
        </div>

        {/* Central Quote / Hero Text */}
        <div className="relative z-20 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card text-white text-xs font-bold leading-none tracking-wide"
          >
            <div className="p-1 bg-primary rounded-full animate-pulse">
               <Zap size={12} className="text-white" />
            </div>
            REVOLUCIONANDO A GESTÃO PEDAGÓGICA
          </motion.div>
          
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl xl:text-7xl font-heading font-black text-white leading-[0.95] tracking-tightest drop-shadow-2xl"
            >
              Conecte-se ao <br/>
              <span className="text-primary italic inline-block relative">
                Futuro
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 blur-sm" />
              </span> do Ensino.
            </motion.h2>
            <motion.p 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="text-white/60 text-xl max-w-sm font-sans leading-relaxed tracking-tight"
            >
              Simplicidade, inteligência e alta performance em uma única plataforma integrada.
            </motion.p>
          </div>
        </div>

        {/* Global Stats or Proof Section */}
        <div className="relative z-20 flex gap-12">
            <div className="flex flex-col gap-1 border-l-2 border-primary/40 pl-4 py-1">
               <span className="text-2xl font-black text-white leading-none">2.4k</span>
               <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Alunos Atendidos</span>
            </div>
            <div className="flex flex-col gap-1 border-l-2 border-primary/40 pl-4 py-1">
               <span className="text-2xl font-black text-white leading-none">98%</span>
               <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Feedback Docente</span>
            </div>
        </div>
      </div>

      {/* LADO DO FORMULÁRIO (DIREITO) */}
      <div className="flex items-center justify-center p-8 z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm space-y-10"
        >
          {/* Form Header */}
          <div className="text-center space-y-4">
            <div className="inline-block p-4 rounded-3xl bg-primary/5 border border-primary/10 lg:hidden mb-6">
                <span className="text-3xl font-black text-primary">S</span>
            </div>
            <h1 className="text-4xl font-heading font-black text-foreground tracking-tightest uppercase-none">Portal Acadêmico</h1>
            <p className="text-muted-foreground text-sm font-bold tracking-tight">
              Seja bem-vindo ao <span className="text-primary/80">ecossistema Edulink</span>.
            </p>
          </div>

          {/* THE FORM CARD */}
          <form onSubmit={handleSubmit} className="glass-card p-10 rounded-[2rem] space-y-8 relative group transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            {/* Top Shine Decoration */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 bg-destructive/10 text-destructive text-xs rounded-2xl border border-destructive/20 flex items-center gap-3 font-black shadow-inner shadow-destructive/5"
              >
                <div className="p-1 bg-destructive/20 rounded-full">
                   <AlertCircle size={14} />
                </div>
                {error}
              </motion.div>
            )}
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black text-muted-foreground uppercase tracking-wider pl-1 italic">Vínculo Institucional</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-all group-hover:scale-110" />
                  <Input
                    id="email"
                    type="email"
                    required
                    className="pl-12 h-14 bg-background/40 border-border/50 focus:bg-background transition-all rounded-2xl focus:ring-[6px] focus:ring-primary/10 focus:border-primary font-bold placeholder:text-muted-foreground/30 text-lg"
                    placeholder="ex: nome@senai.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between pl-1">
                  <Label htmlFor="password" title="Senha da rede" className="text-[10px] font-black text-muted-foreground uppercase tracking-wider italic">Senha de Segurança</Label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-all group-hover:scale-110" />
                  <Input
                    id="password"
                    type="password"
                    required
                    className="pl-12 h-14 bg-background/40 border-border/50 focus:bg-background transition-all rounded-2xl focus:ring-[6px] focus:ring-primary/10 focus:border-primary font-bold placeholder:text-muted-foreground/30 text-lg"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className={cn(
                "w-full h-14 text-lg font-black shadow-2xl shadow-primary/30 rounded-2xl transition-all active:scale-[0.97] cursor-pointer bg-primary hover:bg-primary/90 text-white tracking-widest uppercase-none",
                loading && "opacity-80 scale-100"
              )}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Sincronizando...
                </div>
              ) : "Acessar Portal"}
            </Button>
            
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-border/30">
               <ShieldCheck size={14} className="text-emerald-500 animate-pulse"/>
               <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Acesso Criptografado e Monitorado</span>
            </div>
          </form>

          <footer className="text-center px-6">
             <p className="text-[11px] text-muted-foreground/40 leading-relaxed font-bold uppercase tracking-widest">
               Design by Creative Labs &copy; 2026 Edulink
             </p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
