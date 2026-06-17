import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useKargo } from "@/lib/kargo/store";
import { DataTable } from "@/components/kargo/DataTable";
import { Button } from "@/components/ui/button";
import { ModalCrearBus } from "@/components/kargo/ModalCrearBus";
import { Truck, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_kargo/coord-op/buses")({
  head: () => ({ meta: [{ title: "Buses · Coord. Operador · KARGO" }] }),
  component: BusesPage,
});

function BusesPage() {
  const buses = useKargo((s) => s.buses);
  const crear = useKargo((s) => s.crearBus);
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5"><Truck size={12} /> Coord. Operador</div>
          <h1 className="text-2xl font-semibold tracking-tight">Buses y flota</h1>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}><Plus size={14} /> Nuevo bus</Button>
      </div>

      <DataTable
        rows={buses}
        searchKeys={["id", "patente", "modelo", "zona"]}
        columns={[
          { key: "id", label: "ID", render: (b) => <span className="font-mono text-xs text-muted-foreground">{b.id}</span> },
          { key: "patente", label: "Patente", render: (b) => <span className="font-mono font-semibold text-bus">{b.patente}</span> },
          { key: "modelo", label: "Modelo" },
          { key: "capacidad", label: "Capacidad", align: "right" },
          { key: "zona", label: "Zona" },
          { key: "estado", label: "Estado", render: (b) => <span className={cn("rounded-full px-2 py-0.5 text-xs", b.estado === "disponible" ? "bg-success/15 text-success" : b.estado === "en-ruta" ? "bg-primary/15 text-primary" : "bg-warning/15 text-warning")}>{b.estado}</span> },
        ]}
      />

      <ModalCrearBus open={open} onOpenChange={setOpen} onCreate={(b) => { crear(b); toast.success(`Bus ${b.patente} agregado`); }} />
    </div>
  );
}
