"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { linkTeacherAction } from "../actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LinkTeacherDialog({ classId, className, allTeachers, classTeachers }: any) {
  const [open, setOpen] = useState(false);
  const [teacherId, setTeacherId] = useState("");

  // Filter out teachers that are already linked
  const availableTeachers = allTeachers.filter((t: any) => 
    !classTeachers.some((ct: any) => ct.id === t.id)
  );

  async function handleSubmit(formData: FormData) {
    if (!teacherId) return;
    await linkTeacherAction(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="w-full mt-2 h-7 text-xs gap-1.5 border-dashed" />}>
        <Plus size={14}/> Vincular Docente
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vincular Docente à Turma</DialogTitle>
          <DialogDescription>
            Adicione um professor à turma <strong>{className}</strong>.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <input type="hidden" name="classId" value={classId} />
          <input type="hidden" name="teacherId" value={teacherId} />
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Selecione o Docente</Label>
              <Select value={teacherId} onValueChange={(val) => setTeacherId(val || "")}>
                <SelectTrigger className="font-medium">
                  <SelectValue placeholder="Escolha um docente...">
                    {allTeachers.find((t: any) => t.id === teacherId)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableTeachers.length === 0 ? (
                    <div className="p-2 text-sm text-center text-muted-foreground">Todos já vinculados.</div>
                  ) : (
                    availableTeachers.map((t: any) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!teacherId}>Confirmar Vínculo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
