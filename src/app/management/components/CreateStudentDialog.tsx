"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createStudentAction } from "../actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CreateStudentDialog({ classes }: { classes: any[] }) {
  const [open, setOpen] = useState(false);
  const [classId, setClassId] = useState("");

  async function handleSubmit(formData: FormData) {
    await createStudentAction(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
        <Plus size={16}/> Novo Aluno
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Aluno</DialogTitle>
          <DialogDescription>
            Crie um novo aluno e vincule-o imediatamente a uma turma existente.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo do Aluno</Label>
              <Input id="name" name="name" placeholder="Nome Completo" required />
            </div>
            <div className="space-y-2">
              <Label>Turma</Label>
              <input type="hidden" name="classId" value={classId} required />
              <Select value={classId} onValueChange={(val) => setClassId(val || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!classId}>Cadastrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
