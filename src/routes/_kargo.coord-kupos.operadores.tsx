import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useKargo } from "@/lib/kargo/store";
import { DataTable } from "@/components/kargo/DataTable";
import { Button } from "@/components/ui/button";
import { ModalCrearOperador } from "@/components/kargo/ModalCrearOperador";
import { Building2, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_kargo/coord-kupos/operadores")({
  head: () => ({ meta: [{ title: "Operadores · Coord. Kupos · KARGO" }] }),
  component: OperadoresPage,
});

function OperadoresPage() {
  const operadores = useKargo((s) => s.operadores);
  const crear = useKargo((s) => s.crearOperador);
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5"><Building2 size={12} /> Kupos Global</div>
          <h1 className="text-2xl font-semibold tracking-tight">Operadores Logísticos</h1>
          <p className="text-sm text-muted-foreground">Alta, baja y modificación de operadores zonales.</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}><Plus size={14} /> Nuevo operador</Button>
      </div>

      <DataTable
        rows={operadores}
        searchKeys={["id", "nombre", "zona", "contacto"]}
        searchPlaceholder="Buscar operador, zona…"
        columns={[
          { key: "id", label: "ID", render: (o) => <span className="font-mono text-xs text-muted-foreground">{o.id}</span> },
          { key: "nombre", label: "Operador", render: (o) => <span className="font-semibold">{o.nombre}</span> },
          { key: "zona", label: "Zona" },
          { key: "contacto", label: "Contacto" },
          { key: "telefono", label: "Teléfono", render: (o) => <span className="text-muted-foreground">{o.telefono}</span> },
          { key: "flota", label: "Flota", align: "right" },
          { key: "drivers", label: "Drivers", align: "right" },
          { key: "sla", label: "SLA", align: "right", render: (o) => <span className={cn("rounded-full px-2 py-0.5 text-xs", o.sla >= 95 ? "bg-success/15 text-success" : "bg-warning/15 text-warning")}>{o.sla}%</span> },
          { key: "estado", label: "Estado", render: (o) => <span className={cn("rounded-full px-2 py-0.5 text-xs", o.estado === "activo" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>{o.estado}</span> },
        ]}
      />

      <ModalCrearOperador open={open} onOpenChange={setOpen} onCreate={(op) => { crear(op); toast.success(`Operador ${op.nombre} creado`); }} />
    </div>
  );
}
