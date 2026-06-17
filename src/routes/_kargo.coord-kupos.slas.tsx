import { createFileRoute } from "@tanstack/react-router";
import { useKargo } from "@/lib/kargo/store";
import { KpiCard } from "@/components/kargo/KpiCard";
import { Gauge, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_kargo/coord-kupos/slas")({
  head: () => ({ meta: [{ title: "SLAs Globales · Coord. Kupos · KARGO" }] }),
  component: SlasPage,
});

function SlasPage() {
  const operadores = useKargo((s) => s.operadores);
  const ots = useKargo((s) => s.ots);
  const total = ots.length;
  const entregadas = ots.filter((o) => o.estado === "finalizada").length;
  const promedio = Math.round(operadores.reduce((a, o) => a + o.sla, 0) / Math.max(1, operadores.length));

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5"><Gauge size={12} /> Kupos Global</div>
        <h1 className="text-2xl font-semibold tracking-tight">SLAs Globales</h1>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <KpiCard label="SLA promedio" value={`${promedio}%`} icon={<Gauge />} tone="primary" />
        <KpiCard label="OTs entregadas" value={entregadas} icon={<TrendingUp />} tone="success" hint={`de ${total} totales`} />
        <KpiCard label="Operadores activos" value={operadores.filter((o) => o.estado === "activo").length} tone="success" />
      </div>

      <div className="kargo-card p-5">
        <div className="mb-3 text-sm font-semibold">SLA por operador</div>
        <div className="space-y-3">
          {operadores.map((op) => (
            <div key={op.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{op.nombre}</span>
                <span className={cn(op.sla >= 95 ? "text-success" : op.sla >= 90 ? "text-warning" : "text-destructive", "font-semibold tabular-nums")}>{op.sla}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full", op.sla >= 95 ? "bg-success" : op.sla >= 90 ? "bg-warning" : "bg-destructive")} style={{ width: `${op.sla}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="kargo-card p-5">
        <div className="mb-3 text-sm font-semibold">Umbrales SLA globales</div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b">
            <tr><th className="py-2 text-left">Métrica</th><th className="py-2 text-right">Mínimo</th><th className="py-2 text-right">Objetivo</th><th className="py-2 text-right">Actual</th></tr>
          </thead>
          <tbody className="divide-y">
            <tr><td className="py-2">OTIF</td><td className="py-2 text-right">90%</td><td className="py-2 text-right">95%</td><td className="py-2 text-right tabular-nums text-success">{total ? Math.round((entregadas / total) * 100) : 0}%</td></tr>
            <tr><td className="py-2">Tiempo de respuesta</td><td className="py-2 text-right">2 h</td><td className="py-2 text-right">1 h</td><td className="py-2 text-right tabular-nums">45 min</td></tr>
            <tr><td className="py-2">Tasa incidencias</td><td className="py-2 text-right">{"<"}5%</td><td className="py-2 text-right">{"<"}2%</td><td className="py-2 text-right tabular-nums text-warning">3.2%</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
