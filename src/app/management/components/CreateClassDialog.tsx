"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createClassAction } from "../actions";

export function CreateClassDialog() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await createClassAction(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
        <Plus size={16}/> Nova Turma
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Nova Turma</DialogTitle>
          <DialogDescription>
            Insira o nome da turma para criar o registro.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome / Código da Turma</Label>
              <Input id="name" name="name" placeholder="Ex: Eletromecânica 2026 T1" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Criar Turma</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
