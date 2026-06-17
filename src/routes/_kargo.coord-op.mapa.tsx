import { createFileRoute } from "@tanstack/react-router";
import { useKargo } from "@/lib/kargo/store";
import { GpsMap } from "@/components/kargo/GpsMap";
import { StateBadge } from "@/components/kargo/StateBadge";
import { Map } from "lucide-react";

export const Route = createFileRoute("/_kargo/coord-op/mapa")({
  head: () => ({ meta: [{ title: "Mapa operacional · Coord. Operador · KARGO" }] }),
  component: MapaPage,
});

function MapaPage() {
  const ots = useKargo((s) => s.ots);
  const enRuta = ots.filter((o) => o.estado === "en-transito");

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5"><Map size={12} /> Coord. Operador</div>
        <h1 className="text-2xl font-semibold tracking-tight">Mapa operacional</h1>
        <p className="text-sm text-muted-foreground">Vista global de buses en tránsito.</p>
      </div>

      <div className="kargo-card overflow-hidden">
        <GpsMap origen="Nacional" destino="Nacional" progreso={50} className="h-[500px]" />
      </div>

      <div className="kargo-card">
        <div className="border-b px-5 py-3 text-sm font-semibold">Buses en ruta ({enRuta.length})</div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-5 py-2 text-left">OT</th><th className="px-5 py-2 text-left">Bus</th><th className="px-5 py-2 text-left">Ruta</th><th className="px-5 py-2 text-left">Driver 2</th><th className="px-5 py-2 text-right">Progreso</th><th className="px-5 py-2 text-left">Estado</th></tr>
          </thead>
          <tbody className="divide-y">
            {enRuta.map((o) => (
              <tr key={o.id}>
                <td className="px-5 py-2 font-mono text-xs font-semibold text-primary">{o.id}</td>
                <td className="px-5 py-2 font-mono text-bus">{o.bus}</td>
                <td className="px-5 py-2">{o.origen} → {o.destino}</td>
                <td className="px-5 py-2">{o.driver2 ?? "—"}</td>
                <td className="px-5 py-2 text-right tabular-nums">{o.progreso}%</td>
                <td className="px-5 py-2"><StateBadge estado={o.estado} /></td>
              </tr>
            ))}
            {!enRuta.length && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No hay buses en ruta.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
