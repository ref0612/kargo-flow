import React from "react";
import * as XLSX from "xlsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UploadCloud } from "lucide-react";
import { useKargo } from "@/lib/kargo/store";

// 1. Aquí le decimos a TypeScript que este componente acepta open y onOpenChange
interface ModalCargaMasivaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModalCargaMasiva({ open, onOpenChange }: ModalCargaMasivaProps) {
  const cargaMasivaOTs = useKargo((state) => state.cargaMasivaOTs); 

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: "binary" });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const data = XLSX.utils.sheet_to_json(worksheet);

      const ordenesNuevas = data.map((row: any) => ({
        merchant: row.Merchant || "Carga Excel", 
        origen: row.Origen || "Sin Origen",
        destino: row.Destino || "Sin Destino",
        bultos: Number(row.Bultos) || 1,
      }));

      cargaMasivaOTs(ordenesNuevas);

      // Cerramos el modal avisándole al componente padre (la vista de Órdenes)
      onOpenChange(false);
    };

    reader.readAsBinaryString(file);
  };

  return (
    // 2. Conectamos el estado de apertura/cierre al Dialog
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subir OTs Masivas</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-muted-foreground/25 bg-muted/50">
          <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
          <p className="mb-2 text-sm text-center text-muted-foreground">
            Arrastra tu archivo Excel aquí o haz clic para seleccionarlo.
          </p>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary/10 file:text-primary
              hover:file:bg-primary/20
              cursor-pointer"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}