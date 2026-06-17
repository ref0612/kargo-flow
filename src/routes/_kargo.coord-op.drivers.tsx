import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useKargo } from "@/lib/kargo/store";
import { DataTable } from "@/components/kargo/DataTable";
import { Button } from "@/components/ui/button";
import { ModalCrearDriver } from "@/components/kargo/ModalCrearDriver";
import { IdCard, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_kargo/coord-op/drivers")({
  head: () => ({ meta: [{ title: "Drivers · Coord. Operador · KARGO" }] }),
  component: DriversPage,
});

function DriversPage() {
  const drivers = useKargo((s) => s.drivers);
  const crear = useKargo((s) => s.crearDriver);
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5"><IdCard size={12} /> Coord. Operador</div>
          <h1 className="text-2xl font-semibold tracking-tight">Drivers locales</h1>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}><Plus size={14} /> Nuevo driver</Button>
      </div>

      <DataTable
        rows={drivers}
        searchKeys={["id", "nombre", "rut", "zona"]}
        columns={[
          { key: "id", label: "ID", render: (d) => <span className="font-mono text-xs text-muted-foreground">{d.id}</span> },
          { key: "nombre", label: "Nombre", render: (d) => <span className="font-semibold">{d.nombre}</span> },
          { key: "rut", label: "RUT" },
          { key: "tipo", label: "Tipo", render: (d) => <span className={cn("rounded-full px-2 py-0.5 text-xs", d.tipo === "D1" ? "bg-warning/15 text-warning" : "bg-bus/15 text-bus")}>{d.tipo}</span> },
          { key: "zona", label: "Zona" },
          { key: "telefono", label: "Teléfono", render: (d) => <span className="text-muted-foreground">{d.telefono}</span> },
          { key: "licencia", label: "Licencia" },
          { key: "estado", label: "Estado", render: (d) => <span className={cn("rounded-full px-2 py-0.5 text-xs", d.estado === "disponible" ? "bg-success/15 text-success" : d.estado === "ocupado" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground")}>{d.estado}</span> },
        ]}
      />

      <ModalCrearDriver open={open} onOpenChange={setOpen} onCreate={(d) => { crear(d); toast.success(`Driver ${d.nombre} creado`); }} />
    </div>
  );
}
