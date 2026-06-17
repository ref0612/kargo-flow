import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useKargo } from "@/lib/kargo/store";
import { StateBadge } from "@/components/kargo/StateBadge";
import { StepBar } from "@/components/kargo/StepBar";
import { ProgressRing } from "@/components/kargo/ProgressRing";
import { GpsMap } from "@/components/kargo/GpsMap";
import { MapPin, Bus, Clock, Gauge } from "lucide-react";

export const Route = createFileRoute("/_kargo/merchant/seguimiento")({
  head: () => ({ meta: [{ title: "Seguimiento · Merchant · KARGO" }] }),
  component: SeguimientoPage,
});

function SeguimientoPage() {
  const ots = useKargo((s) => s.ots);
  const activos = ots.filter((o) => o.estado !== "finalizada");
  const [selId, setSelId] = useState<string | null>(activos[0]?.id ?? null);
  const sel = ots.find((o) => o.id === selId) ?? activos[0];

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">Merchant</div>
        <h1 className="text-2xl font-semibold tracking-tight">Seguimiento en vivo</h1>
        <p className="text-sm text-muted-foreground">Vista detallada con mapa, ETA y progreso por OT.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="kargo-card max-h-[700px] overflow-y-auto">
          <div className="border-b px-4 py-3 text-sm font-semibold">OTs activas ({activos.length})</div>
          <div className="divide-y">
            {activos.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelId(o.id)}
                className={`flex w-full flex-col gap-1 px-4 py-3 text-left text-sm hover:bg-muted/50 ${sel?.id === o.id ? "bg-primary/5 border-l-2 border-primary" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-primary">{o.id}</span>
                  <StateBadge estado={o.estado} />
                </div>
                <div className="text-xs text-muted-foreground">{o.origen} → {o.destino}</div>
                <div className="text-[10px] text-muted-foreground">{o.bultos} bultos · {o.progreso}%</div>
              </button>
            ))}
          </div>
        </div>

        {sel ? (
          <div className="space-y-4">
            <div className="kargo-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{sel.id}</span>
                    <StateBadge estado={sel.estado} />
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{sel.origen} → {sel.destino}</div>
                  <div className="text-sm text-muted-foreground">{sel.merchant} · {sel.bultos} bultos</div>
                </div>
                <ProgressRing value={sel.progreso} label="Avance" />
              </div>
            </div>

            <div className="kargo-card overflow-hidden">
              <GpsMap origen={sel.origen} destino={sel.destino} progreso={sel.progreso} velocidad={sel.estado === "en-transito" ? 85 : undefined} className="h-[320px]" />
              <div className="grid grid-cols-2 gap-px bg-border text-xs sm:grid-cols-4">
                {[
                  { i: <MapPin size={14} />, l: "Origen", v: sel.origen },
                  { i: <MapPin size={14} />, l: "Destino", v: sel.destino },
                  { i: <Bus size={14} />, l: "Bus", v: sel.bus ?? "—" },
                  { i: <Clock size={14} />, l: "ETA", v: sel.estado === "en-transito" ? "16/05 07:30" : "—" },
                ].map((c) => (
                  <div key={c.l} className="flex items-center gap-2 bg-card px-4 py-2.5">
                    <span className="text-muted-foreground">{c.i}</span>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.l}</div>
                      <div className="font-medium">{c.v}</div>
                    </div>
                  </div>
                ))}
              </div>
              <StepBar estado={sel.estado} />
              <div className="flex items-center justify-between border-t bg-muted/30 px-5 py-2.5 text-xs">
                <span className="flex items-center gap-1.5"><Gauge size={12} className="text-primary" /> {sel.progreso}% completado</span>
                <span className="text-muted-foreground">Driver 1: {sel.driver1 ?? "—"} · Driver 2: {sel.driver2 ?? "—"}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="kargo-card p-12 text-center text-muted-foreground">Sin OTs activas</div>
        )}
      </div>
    </div>
  );
}
