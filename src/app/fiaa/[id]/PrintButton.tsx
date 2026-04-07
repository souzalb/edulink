"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button 
      variant="outline" 
      onClick={handlePrint}
      className="text-muted-foreground hover:text-foreground flex items-center gap-2 font-medium bg-card px-4 py-2 h-auto rounded-lg shadow-sm border border-border no-print transition-colors"
    >
      <Printer size={18} /> 
      Imprimir FIAA
    </Button>
  );
}
