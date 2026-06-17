import { createFileRoute } from "@tanstack/react-router";
import { useKargo } from "@/lib/kargo/store";
import { cn } from "@/lib/utils";
import type { OTEstado } from "@/lib/kargo/types";

export const Route = createFileRoute("/_kargo/coord-op/kanban")({
  head: () => ({ meta: [{ title: "Kanban · Coord. Operador · KARGO" }] }),
  component: KanbanPage,
});

const COLS: { key: string; label: string; estados: OTEstado[]; tone: string }[] = [
  { key: "creada", label: "Por asignar", estados: ["creada"], tone: "text-info" },
  { key: "recoleccion", label: "Recolección", estados: ["recolectada", "asignada"], tone: "text-warning" },
  { key: "wh1", label: "Warehouse 1", estados: ["wh1"], tone: "text-bus" },
  { key: "transito", label: "En tránsito", estados: ["en-transito"], tone: "text-primary" },
  { key: "final", label: "Entregadas", estados: ["finalizada"], tone: "text-success" },
];

function KanbanPage() {
  const ots = useKargo((s) => s.ots);

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">Coord. Operador</div>
        <h1 className="text-2xl font-semibold tracking-tight">Kanban operacional</h1>
      </div>

      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
        {COLS.map((c) => {
          const items = ots.filter((o) => c.estados.includes(o.estado));
          return (
            <div key={c.key} className="kargo-card flex min-h-[500px] flex-col">
              <div className="flex items-center justify-between border-b px-3 py-2.5">
                <div className={cn("text-xs font-semibold uppercase tracking-wider", c.tone)}>{c.label}</div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums">{items.length}</span>
              </div>
              <div className="flex flex-col gap-2 p-2">
                {items.map((o) => (
                  <div key={o.id} className="rounded-md border bg-card p-2.5 text-xs shadow-sm hover:border-primary">
                    <div className="font-mono font-semibold text-primary">{o.id}</div>
                    <div className="mt-0.5 text-muted-foreground">{o.merchant} · {o.destino}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {o.driver1 && <span className="rounded-full bg-warning/10 px-1.5 py-0.5 text-[10px] text-warning">D1: {o.driver1.split(" ")[0]}</span>}
                      {o.bus && <span className="rounded-full bg-bus/10 px-1.5 py-0.5 text-[10px] text-bus">{o.bus}</span>}
                      {o.estado === "en-transito" && <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">{o.progreso}%</span>}
                    </div>
                  </div>
                ))}
                {!items.length && <div className="py-6 text-center text-xs text-muted-foreground">vacío</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
