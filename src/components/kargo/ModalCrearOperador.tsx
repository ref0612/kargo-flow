import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Operador } from "@/lib/kargo/types";

export function ModalCrearOperador({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (op: Omit<Operador, "id">) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [zona, setZona] = useState("Región Metropolitana");
  const [contacto, setContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [flota, setFlota] = useState(5);
  const [drivers, setDrivers] = useState(10);
  const [sla, setSla] = useState(95);

  const submit = () => {
    if (!nombre.trim()) return;
    onCreate({ nombre, zona, contacto, telefono, flota, drivers, sla, estado: "activo" });
    setNombre(""); setContacto(""); setTelefono("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Nuevo Operador Logístico</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div><Label>Nombre del operador</Label><Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Op. Atacama" /></div>
          <div>
            <Label>Zona</Label>
            <Select value={zona} onValueChange={setZona}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Región Metropolitana", "I-IV Norte", "V Región", "VIII Región", "X-XII Región"].map((z) => (
                  <SelectItem key={z} value={z}>{z}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Contacto</Label><Input value={contacto} onChange={(e) => setContacto(e.target.value)} /></div>
            <div><Label>Teléfono</Label><Input value={telefono} onChange={(e) => setTelefono(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Flota</Label><Input type="number" min={0} value={flota} onChange={(e) => setFlota(parseInt(e.target.value || "0"))} /></div>
            <div><Label>Drivers</Label><Input type="number" min={0} value={drivers} onChange={(e) => setDrivers(parseInt(e.target.value || "0"))} /></div>
            <div><Label>SLA (%)</Label><Input type="number" min={0} max={100} value={sla} onChange={(e) => setSla(parseInt(e.target.value || "0"))} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit}>Crear operador</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
