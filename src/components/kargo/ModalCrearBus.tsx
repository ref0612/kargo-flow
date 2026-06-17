import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Bus } from "@/lib/kargo/types";

export function ModalCrearBus({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (b: Omit<Bus, "id">) => void;
}) {
  const [patente, setPatente] = useState("");
  const [modelo, setModelo] = useState("Mercedes O500");
  const [capacidad, setCapacidad] = useState(48);
  const [zona, setZona] = useState("Centro");

  const submit = () => {
    if (!patente.trim()) return;
    onCreate({ patente: patente.toUpperCase(), modelo, capacidad, zona, estado: "disponible" });
    setPatente("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Nuevo Bus / Vehículo</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Patente</Label><Input value={patente} onChange={(e) => setPatente(e.target.value)} placeholder="AB-CD-12" /></div>
            <div>
              <Label>Modelo</Label>
              <Select value={modelo} onValueChange={setModelo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Mercedes O500", "Volvo 9800", "Scania K410", "Iveco Daily", "Hyundai Mighty"].map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Capacidad (bultos)</Label><Input type="number" min={1} value={capacidad} onChange={(e) => setCapacidad(parseInt(e.target.value || "1"))} /></div>
            <div>
              <Label>Zona</Label>
              <Select value={zona} onValueChange={setZona}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Norte", "Centro", "Sur"].map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit}>Agregar bus</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
