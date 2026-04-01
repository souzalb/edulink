"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, AlertCircle } from "lucide-react";
import { createBulkStudentsAction } from "../actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function CreateBulkStudentsDialog({ classes }: { classes: any[] }) {
  const [open, setOpen] = useState(false);
  const [classId, setClassId] = useState("");
  const [names, setNames] = useState("");

  const studentCount = names
    .split("\n")
    .map(n => n.trim())
    .filter(n => n.length > 0).length;

  async function handleSubmit(formData: FormData) {
    try {
      await createBulkStudentsAction(formData);
      setOpen(false);
      setNames("");
      setClassId("");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar alunos. Verifique os dados e tente novamente.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="h-10 rounded-xl gap-2 font-semibold shadow-sm px-5 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary transition-all" />}>
        <Users size={18}/> Cadastro em Massa
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastro em Massa</DialogTitle>
          <DialogDescription>
            Cole uma lista de nomes (um por linha) para cadastrar vários alunos de uma vez na turma selecionada.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Turma de Destino</Label>
              <input type="hidden" name="classId" value={classId} required />
              <Select value={classId} onValueChange={(val) => setClassId(val || "")}>
                <SelectTrigger className="font-medium h-11 rounded-xl">
                  <SelectValue placeholder="Selecione a turma...">
                    {classes.find(c => c.id === classId)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="names">Lista de Nomes</Label>
                {studentCount > 0 && (
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {studentCount} {studentCount === 1 ? 'aluno detectado' : 'alunos detectados'}
                  </span>
                )}
              </div>
              <Textarea 
                id="names" 
                name="names" 
                placeholder="Exemplo:&#10;João Silva&#10;Maria Oliveira&#10;Pedro Santos" 
                className="min-h-[200px] rounded-xl resize-none font-inter text-sm"
                required 
                value={names}
                onChange={(e) => setNames(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-1 px-1">
                <AlertCircle size={12} /> Pressione Enter entre cada nome.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button type="submit" disabled={!classId || studentCount === 0} className="rounded-xl px-8 shadow-md">
              Confirmar Cadastro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
