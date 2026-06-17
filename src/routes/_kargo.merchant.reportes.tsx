import { createFileRoute } from "@tanstack/react-router";
import { useKargo } from "@/lib/kargo/store";
import { KpiCard } from "@/components/kargo/KpiCard";
import { ProgressRing } from "@/components/kargo/ProgressRing";
import { BarChart3, TrendingUp, ShieldCheck, ThumbsUp } from "lucide-react";

export const Route = createFileRoute("/_kargo/merchant/reportes")({
  head: () => ({ meta: [{ title: "Reportes / SLA · Merchant · KARGO" }] }),
  component: ReportesPage,
});

function ReportesPage() {
  const ots = useKargo((s) => s.ots);
  const total = ots.length;
  const entregadas = ots.filter((o) => o.estado === "finalizada").length;
  const incidencias = ots.filter((o) => o.estado === "incidencia").length;
  const otif = total ? Math.round((entregadas / total) * 100) : 0;
  const nps = 72;
  const cumplimiento = total ? Math.round(((total - incidencias) / total) * 100) : 100;

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
          <BarChart3 size={12} /> Merchant
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Reportes y SLA</h1>
        <p className="text-sm text-muted-foreground">Métricas de servicio, OTIF, NPS y cumplimiento de SLA.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <KpiCard label="OTIF" value={`${otif}%`} icon={<ShieldCheck />} tone="success" hint="On Time In Full" />
        <KpiCard label="NPS" value={nps} icon={<ThumbsUp />} tone="primary" hint="Satisfacción cliente" />
        <KpiCard label="Cumplimiento SLA" value={`${cumplimiento}%`} icon={<TrendingUp />} tone="warning" />
        <KpiCard label="Total OTs" value={total} tone="primary" hint={`${entregadas} entregadas`} />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="kargo-card p-6 flex flex-col items-center">
          <div className="text-sm font-semibold mb-3">OTIF mensual</div>
          <ProgressRing value={otif} size={140} />
        </div>
        <div className="kargo-card p-6 flex flex-col items-center">
          <div className="text-sm font-semibold mb-3">NPS</div>
          <ProgressRing value={nps} size={140} />
        </div>
        <div className="kargo-card p-6 flex flex-col items-center">
          <div className="text-sm font-semibold mb-3">SLA</div>
          <ProgressRing value={cumplimiento} size={140} />
        </div>
      </div>

      <div className="kargo-card p-5">
        <div className="mb-3 text-sm font-semibold">Detalle por mes</div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="py-2 text-left">Mes</th><th className="py-2 text-right">OTIF</th><th className="py-2 text-right">NPS</th><th className="py-2 text-right">SLA</th><th className="py-2 text-right">OTs</th></tr>
          </thead>
          <tbody className="divide-y">
            {[
              { m: "Marzo", otif: 94, nps: 68, sla: 96, ots: 184 },
              { m: "Abril", otif: 91, nps: 70, sla: 93, ots: 212 },
              { m: "Mayo", otif: otif, nps: nps, sla: cumplimiento, ots: total },
            ].map((r) => (
              <tr key={r.m}>
                <td className="py-2">{r.m}</td>
                <td className="py-2 text-right tabular-nums">{r.otif}%</td>
                <td className="py-2 text-right tabular-nums">{r.nps}</td>
                <td className="py-2 text-right tabular-nums">{r.sla}%</td>
                <td className="py-2 text-right tabular-nums">{r.ots}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
