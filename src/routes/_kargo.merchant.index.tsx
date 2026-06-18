import { createFileRoute } from "@tanstack/react-router";
import { useKargo } from "@/lib/kargo/store";
import { KpiCard } from "@/components/kargo/KpiCard";
import { StateBadge } from "@/components/kargo/StateBadge";
import { Package, Truck, AlertTriangle, CheckCircle2, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/_kargo/merchant/")({
  head: () => ({ meta: [{ title: "Dashboard · Merchant · KARGO" }] }),
  component: MerchantDashboard,
});

function MerchantDashboard() {
  const ots = useKargo((s) => s.ots);

  // Cálculos para los KPIs
  const activas = ots.filter(o => !["finalizada", "cancelada"].includes(o.estado)).length;
  const entregadas = ots.filter(o => o.estado === "finalizada").length;
  const incidencias = ots.filter(o => o.estado === "incidencia").length;
  const total = ots.length;
  const sla = total > 0 ? Math.round((entregadas / total) * 100) : 100;

  // Últimas 5 OTs para la vista rápida
  const recientes = [...ots].reverse().slice(0, 5);

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5 mb-1">
            <LayoutDashboard size={12} /> Dashboard
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Resumen General</h1>
          <p className="text-sm text-muted-foreground">Métricas en tiempo real de tu operación logística.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="OTs Activas" value={activas.toString()} icon={<Package className="text-blue-500" />} />
        <KpiCard title="Entregadas" value={entregadas.toString()} icon={<CheckCircle2 className="text-emerald-500" />} />
        <KpiCard title="Incidencias" value={incidencias.toString()} icon={<AlertTriangle className="text-rose-500" />} trend={incidencias > 0 ? "down" : "up"} trendValue={incidencias > 0 ? "Revisar" : "Óptimo"} />
        <KpiCard title="SLA de Entrega" value={`${sla}%`} icon={<Truck className="text-indigo-500" />} trend="up" trendValue="Target: >95%" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Panel de Órdenes Recientes */}
        <div className="border rounded-xl bg-white shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Órdenes Recientes</h2>
          {recientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Package className="w-10 h-10 mb-2 opacity-20" />
              <p className="text-sm">No tienes órdenes recientes.</p>
              <p className="text-xs mt-1">Ve a 'Órdenes' para crear una nueva.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recientes.map(ot => (
                <div key={ot.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-100 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-blue-700">{ot.id}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{ot.origen} → {ot.destino}</p>
                  </div>
                  <StateBadge estado={ot.estado} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Placeholder para gráfico futuro */}
        <div className="border rounded-xl bg-white shadow-sm p-5 flex flex-col justify-center items-center text-center h-full min-h-[250px] bg-gradient-to-b from-slate-50 to-white">
          <Truck className="w-12 h-12 text-slate-200 mb-3" />
          <h2 className="font-semibold text-slate-700">Rendimiento Operativo</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
            Espacio reservado para métricas de envíos por mes o gráficos de volumen.
          </p>
        </div>
      </div>
    </div>
  );
}