import { createFileRoute } from "@tanstack/react-router";
import { useKargo } from "@/lib/kargo/store";
import { BellRing, AlertTriangle, Clock, MapPinOff } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_kargo/coord-op/alertas")({
  head: () => ({ meta: [{ title: "Alertas · Coord. Operador · KARGO" }] }),
  component: AlertasPage,
});

interface Alerta {
  id: string;
  tipo: "parada" | "timeout" | "ruta" | "general";
  severidad: "alta" | "media" | "baja";
  titulo: string;
  detalle: string;
  fecha: string;
  otId?: string;
}

function AlertasPage() {
  const ots = useKargo((s) => s.ots);
  const alertas: Alerta[] = [];

  ots.filter((o) => o.estado === "creada").forEach((o) => {
    alertas.push({ id: `A-${o.id}-pend`, tipo: "timeout", severidad: "media", titulo: "OT sin asignar", detalle: `${o.id} lleva sin Driver 1 asignado`, fecha: o.creada, otId: o.id });
  });
  ots.filter((o) => o.estado === "wh1").forEach((o) => {
    alertas.push({ id: `A-${o.id}-wh1`, tipo: "ruta", severidad: "media", titulo: "OT esperando bus", detalle: `${o.id} en WH1 sin bus asignado`, fecha: o.creada, otId: o.id });
  });
  ots.filter((o) => o.estado === "incidencia").forEach((o) => {
    alertas.push({ id: `A-${o.id}-inc`, tipo: "general", severidad: "alta", titulo: "Incidencia activa", detalle: `${o.id} reportada con incidencia`, fecha: o.creada, otId: o.id });
  });
  alertas.push({ id: "A-parada-01", tipo: "parada", severidad: "alta", titulo: "Parada no programada", detalle: "Bus AB-CD-12 detenido 18 min en Ruta 5 KM 245", fecha: "15/05 14:32" });
  alertas.push({ id: "A-timeout-01", tipo: "timeout", severidad: "alta", titulo: "Timeout de check-in", detalle: "Driver Juan Martínez sin check-in hace 45 min", fecha: "15/05 13:50" });

  const sevClass = (s: Alerta["severidad"]) => s === "alta" ? "border-destructive/30 bg-destructive/5" : s === "media" ? "border-warning/30 bg-warning/5" : "border-muted bg-muted/30";
  const iconFor = (t: Alerta["tipo"]) => t === "parada" ? MapPinOff : t === "timeout" ? Clock : t === "ruta" ? AlertTriangle : BellRing;

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5"><BellRing size={12} /> Coord. Operador</div>
        <h1 className="text-2xl font-semibold tracking-tight">Alertas operacionales</h1>
        <p className="text-sm text-muted-foreground">Paradas no programadas, timeouts y desviaciones de ruta.</p>
      </div>

      <div className="grid gap-3">
        {alertas.map((a) => {
          const Icon = iconFor(a.tipo);
          return (
            <div key={a.id} className={cn("rounded-lg border p-4 flex items-start gap-3", sevClass(a.severidad))}>
              <div className="grid size-9 place-items-center rounded-md bg-card border">
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{a.titulo}</span>
                  <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] uppercase tracking-wider", a.severidad === "alta" ? "bg-destructive text-destructive-foreground" : a.severidad === "media" ? "bg-warning text-warning-foreground" : "bg-muted")}>{a.severidad}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{a.detalle}</div>
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">{a.fecha}</div>
            </div>
          );
        })}
        {!alertas.length && <div className="kargo-card p-8 text-center text-muted-foreground">Sin alertas activas.</div>}
      </div>
    </div>
  );
}
