"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, Sparkles, ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-white">
      
      {/* LADO VISUAL (ESQUERDO) */}
      <div className="hidden lg:flex relative bg-zinc-900 border-r border-white/10 flex-col justify-between p-12">
        <div 
          className="absolute inset-0 bg-cover bg-center brightness-75 transition-transform duration-10000 hover:scale-110"
          style={{ backgroundImage: "url('/login-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-black/20" />
        
        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg border border-red-700/30">
            <span className="text-white font-bold text-xl select-none">S</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-none tracking-tight">SENAI</span>
            <span className="text-[10px] text-white/60 font-semibold uppercase tracking-widest leading-none mt-1">Mariano Ferraz</span>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="relative z-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs backdrop-blur-sm"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>Excelência Tecnológica em Educação</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl xl:text-5xl font-outfit font-bold text-white leading-tight max-w-lg"
          >
            Acompanhamento <span className="text-primary italic">Pedagógico</span> de Próxima Geração.
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.6 }}
             className="text-white/60 text-lg max-w-md font-inter"
          >
            Plataforma Edulink: Conectando docentes, coordenação e o futuro dos nossos alunos.
          </motion.p>
        </div>

        {/* Footer Credit */}
        <div className="relative z-10 text-white/30 text-xs font-medium">
          © 2026 Edulink Pedagogical Suite. Todos os direitos reservados.
        </div>
      </div>

      {/* LADO DO FORMULÁRIO (DIREITO) */}
      <div className="flex items-center justify-center p-8 bg-zinc-50/50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-outfit font-bold text-zinc-900 tracking-tight">Portal de Acesso</h1>
            <p className="text-zinc-500 text-sm font-medium">
              Bem-vindo ao <span className="text-primary font-bold">Edulink</span>. Insira seus dados abaixo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl shadow-zinc-200/50">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 flex items-center gap-2 font-semibold"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Email Acadêmico</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    required
                    className="pl-10 h-11 bg-zinc-50 border-zinc-200 focus:bg-white transition-all rounded-xl focus:ring-primary focus:border-primary cursor-text"
                    placeholder="docente@senai.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between pl-1">
                  <Label htmlFor="password" title="Senha de acesso à rede" className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Senha de Rede</Label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    required
                    className="pl-10 h-11 bg-zinc-50 border-zinc-200 focus:bg-white transition-all rounded-xl focus:ring-primary focus:border-primary cursor-text"
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
                "w-full h-11 text-base font-bold shadow-lg shadow-primary/20 rounded-xl transition-all active:scale-95 cursor-pointer",
                loading && "opacity-80"
              )}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                   Autenticando...
                </span>
              ) : "Entrar no Sistema"}
            </Button>
            
            <div className="flex items-center justify-center gap-2 pt-2">
               <ShieldCheck size={14} className="text-emerald-600"/>
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Acesso Restrito e Seguro</span>
            </div>
          </form>

          <footer className="text-center flex flex-col gap-4">
             <p className="text-[11px] text-zinc-400 leading-relaxed px-4">
               Ao entrar, você concorda com as políticas de segurança da informação do SENAI-SP.
             </p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
