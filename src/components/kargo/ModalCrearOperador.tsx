import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Operador } from "@/lib/kargo/types";

const CIUDADES_CHILE = ["Santiago", "Valparaiso", "Concepcion", "Antofagasta", "La Serena"];

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
  const [rol, setRol] = useState<Operador["rol"]>("DRIVER_1");
  const [ciudadesSeleccionadas, setCiudadesSeleccionadas] = useState<string[]>([]);
  const [contacto, setContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [flota, setFlota] = useState(5);
  const [drivers, setDrivers] = useState(10);
  const [sla, setSla] = useState(95);

  const toggleCiudad = (ciudad: string) => {
    setCiudadesSeleccionadas((prev) =>
      prev.includes(ciudad) ? prev.filter((c) => c !== ciudad) : [...prev, ciudad]
    );
  };

  const submit = () => {
    if (!nombre.trim()) return;
    onCreate({
      nombre,
      zona,
      rol,
      ciudadesOperacion: ciudadesSeleccionadas,
      contacto,
      telefono,
      flota,
      drivers,
      sla,
      estado: "activo",
    });
    setNombre("");
    setContacto("");
    setTelefono("");
    setRol("DRIVER_1");
    setCiudadesSeleccionadas([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Nuevo Operador Logístico</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div><Label>Nombre del operador</Label><Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Op. Atacama" /></div>
          <div>
            <Label>Rol del operador</Label>
            <Select value={rol ?? "DRIVER_1"} onValueChange={(value) => setRol(value as NonNullable<Operador["rol"]>)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DRIVER_1">Driver 1 (Recoleccion)</SelectItem>
                <SelectItem value="DRIVER_2">Driver 2 (Interurbano)</SelectItem>
                <SelectItem value="DRIVER_3">Driver 3 (Ultima Milla)</SelectItem>
                <SelectItem value="LOADER_1">Loader 1 (Bodega)</SelectItem>
                <SelectItem value="LOADER_2">Loader 2 (Bodega)</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
          <div>
            <Label>Ciudades de operación (asignación zonal)</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {CIUDADES_CHILE.map((ciudad) => {
                const active = ciudadesSeleccionadas.includes(ciudad);
                return (
                  <Button
                    key={ciudad}
                    type="button"
                    size="sm"
                    variant={active ? "default" : "outline"}
                    onClick={() => toggleCiudad(ciudad)}
                  >
                    {ciudad}
                  </Button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              El operador solo sera visible para las OT que coincidan con estas ciudades.
            </p>
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
