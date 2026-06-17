import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Driver } from "@/lib/kargo/types";

export function ModalCrearDriver({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (d: Omit<Driver, "id">) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [tipo, setTipo] = useState<"D1" | "D2">("D1");
  const [zona, setZona] = useState("RM Centro");
  const [telefono, setTelefono] = useState("");
  const [licencia, setLicencia] = useState("A4");

  const submit = () => {
    if (!nombre.trim()) return;
    onCreate({ nombre, rut, tipo, zona, telefono, licencia, estado: "disponible" });
    setNombre(""); setRut(""); setTelefono("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Nuevo Driver</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Nombre</Label><Input value={nombre} onChange={(e) => setNombre(e.target.value)} /></div>
            <div><Label>RUT</Label><Input value={rut} onChange={(e) => setRut(e.target.value)} placeholder="12.345.678-9" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as "D1" | "D2")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="D1">Driver 1 (Pickup)</SelectItem>
                  <SelectItem value="D2">Driver 2 (Bus interurbano)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Zona</Label>
              <Input value={zona} onChange={(e) => setZona(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Teléfono</Label><Input value={telefono} onChange={(e) => setTelefono(e.target.value)} /></div>
            <div>
              <Label>Licencia</Label>
              <Select value={licencia} onValueChange={setLicencia}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["A1", "A2", "A3", "A4", "A5"].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit}>Crear driver</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
