import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { IncidenciaTipo, IncidenciaSeveridad } from "@/lib/kargo/types";

export function ModalIncidencia({
  open,
  onOpenChange,
  otId,
  reportadoPor = "Sistema",
  allowTipo = true,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  otId?: string;
  reportadoPor?: string;
  allowTipo?: boolean;
  onSubmit: (data: { motivo: string; tipo: IncidenciaTipo; severidad: IncidenciaSeveridad; reportadoPor: string }) => void;
}) {
  const [tipo, setTipo] = useState<IncidenciaTipo>("retraso");
  const [severidad, setSeveridad] = useState<IncidenciaSeveridad>("media");
  const [motivo, setMotivo] = useState("");

  const submit = () => {
    if (!motivo.trim()) return;
    onSubmit({ motivo, tipo, severidad, reportadoPor });
    setMotivo("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle size={16} /> Reportar Incidencia {otId && <span className="font-mono text-xs text-muted-foreground">· {otId}</span>}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          {allowTipo && (
            <div>
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as IncidenciaTipo)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="retraso">Retraso</SelectItem>
                  <SelectItem value="daño">Daño en bulto</SelectItem>
                  <SelectItem value="rechazo">Rechazo de cliente</SelectItem>
                  <SelectItem value="extravio">Extravío</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label>Severidad</Label>
            <Select value={severidad} onValueChange={(v) => setSeveridad(v as IncidenciaSeveridad)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="baja">Baja</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Descripción</Label>
            <Textarea rows={4} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Describe la incidencia…" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={submit}>Reportar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
