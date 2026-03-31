import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, ShieldCheck } from "lucide-react";
import Header from "@/components/layout/Header";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  const roleDisplay = user?.role === "DOCENTE" ? "Docente" : 
                      user?.role === "OPP" ? "Orientador Pedagógico" : 
                      user?.role === "AQV_OE" ? "Qualidade de Vida / Coordenação" : "Usuário";

  return (
    <div className="min-h-screen bg-muted/40 pb-12">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">Meu Perfil</h1>
        
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center rounded-full border border-primary/20">
                {user.name?.substring(0, 2).toUpperCase() || "US"}
              </div>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>Informações da sua conta</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <User size={16} />
                  <span className="text-sm font-medium">Nome Completo</span>
                </div>
                <p className="font-medium text-foreground text-lg">{user.name}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Mail size={16} />
                  <span className="text-sm font-medium">Email Acadêmico</span>
                </div>
                <p className="font-medium text-foreground text-lg">{user.email}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <ShieldCheck size={16} />
                  <span className="text-sm font-medium">Cargo/Acesso</span>
                </div>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  {roleDisplay}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
