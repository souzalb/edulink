"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createTeacherAction } from "../actions";

export function CreateTeacherDialog() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await createTeacherAction(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
        <Plus size={16}/> Novo Professor
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Professor (Docente)</DialogTitle>
          <DialogDescription>
            Crie um novo acesso de professor. A senha padrão inicial será <strong>123456</strong>.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" name="name" placeholder="Ex: João da Silva" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail de Acesso</Label>
              <Input id="email" name="email" type="email" placeholder="professor@senai.br" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Cadastrar Professor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
