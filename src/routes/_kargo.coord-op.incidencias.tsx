import { createFileRoute } from "@tanstack/react-router";
import { useKargo } from "@/lib/kargo/store";
import { DataTable } from "@/components/kargo/DataTable";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IncidenciaSeveridad } from "@/lib/kargo/types";

export const Route = createFileRoute("/_kargo/coord-op/incidencias")({
  head: () => ({ meta: [{ title: "Incidencias · Coord. Operador · KARGO" }] }),
  component: IncidenciasOpPage,
});

const SEV_CLR: Record<IncidenciaSeveridad, string> = {
  baja: "bg-muted text-muted-foreground",
  media: "bg-warning/15 text-warning",
  alta: "bg-orange-500/15 text-orange-600",
  critica: "bg-destructive/15 text-destructive",
};

function IncidenciasOpPage() {
  const incidencias = useKargo((s) => s.incidencias);

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5"><AlertTriangle size={12} /> Coord. Operador</div>
        <h1 className="text-2xl font-semibold tracking-tight">Incidencias zonales</h1>
      </div>

      <DataTable
        rows={incidencias}
        searchKeys={["id", "otId", "descripcion"]}
        columns={[
          { key: "id", label: "ID", render: (i) => <span className="font-mono text-xs">{i.id}</span> },
          { key: "otId", label: "OT", render: (i) => <span className="font-mono text-xs font-semibold text-primary">{i.otId}</span> },
          { key: "tipo", label: "Tipo" },
          { key: "severidad", label: "Sev.", render: (i) => <span className={cn("rounded-full px-2 py-0.5 text-xs", SEV_CLR[i.severidad])}>{i.severidad}</span> },
          { key: "descripcion", label: "Descripción" },
          { key: "reportadoPor", label: "Reportado por" },
          { key: "fecha", label: "Fecha", render: (i) => <span className="text-muted-foreground">{i.fecha}</span> },
          { key: "estado", label: "Estado" },
        ]}
      />
    </div>
  );
}
