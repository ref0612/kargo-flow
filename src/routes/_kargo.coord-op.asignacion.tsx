import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useKargo } from "@/lib/kargo/store";
import { Button } from "@/components/ui/button";
import { UserCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_kargo/coord-op/asignacion")({
  head: () => ({ meta: [{ title: "Asignación D1 · Coord. Operador · KARGO" }] }),
  component: AsignacionPage,
});

function AsignacionPage() {
  const ots = useKargo((s) => s.ots);
  const drivers = useKargo((s) => s.drivers).filter((d) => d.tipo === "D1");
  const asignar = useKargo((s) => s.asignarDriver1);
  const [selOt, setSelOt] = useState<string | null>(null);
  const [selDriver, setSelDriver] = useState<string | null>(null);
  const pend = ots.filter((o) => o.estado === "creada");

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">Coord. Operador</div>
        <h1 className="text-2xl font-semibold tracking-tight">Asignación de Driver 1</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="kargo-card lg:col-span-2">
          <div className="border-b px-5 py-3 text-sm font-semibold">OTs pendientes ({pend.length})</div>
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-5 py-2 text-left">OT</th><th className="px-5 py-2 text-left">Merchant</th><th className="px-5 py-2 text-left">Origen</th><th className="px-5 py-2 text-right">Bultos</th><th></th></tr>
            </thead>
            <tbody className="divide-y">
              {pend.map((o) => (
                <tr key={o.id} className={cn("hover:bg-muted/30", selOt === o.id && "bg-primary/5")}>
                  <td className="px-5 py-2 font-mono text-xs font-semibold text-primary">{o.id}</td>
                  <td className="px-5 py-2">{o.merchant}</td>
                  <td className="px-5 py-2">{o.origen}</td>
                  <td className="px-5 py-2 text-right tabular-nums">{o.bultos}</td>
                  <td className="px-5 py-2 text-right">
                    <Button size="sm" variant={selOt === o.id ? "default" : "outline"} className="h-7 text-xs" onClick={() => setSelOt(o.id)}>
                      {selOt === o.id ? "Seleccionada" : "Seleccionar"}
                    </Button>
                  </td>
                </tr>
              ))}
              {!pend.length && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No hay OTs por asignar.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className={cn("kargo-card p-5", !selOt && "opacity-60")}>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><UserCheck size={14} /> Drivers disponibles</div>
          <div className="space-y-2">
            {drivers.filter((d) => d.estado === "disponible").map((d) => (
              <button
                key={d.id}
                disabled={!selOt}
                onClick={() => setSelDriver(d.nombre)}
                className={cn("flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition", selDriver === d.nombre ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted")}
              >
                <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {d.nombre.split(" ").map((n) => n[0]).join("")}
                </span>
                <div className="flex-1">
                  <div>{d.nombre}</div>
                  <div className="text-[10px] text-muted-foreground">{d.zona} · {d.licencia}</div>
                </div>
              </button>
            ))}
          </div>
          <Button className="mt-4 w-full gap-1.5" disabled={!selOt || !selDriver} onClick={() => {
            if (selOt && selDriver) {
              asignar(selOt, selDriver);
              toast.success(`${selOt} asignada a ${selDriver}`);
              setSelOt(null); setSelDriver(null);
            }
          }}>Confirmar <ArrowRight size={14} /></Button>
        </div>
      </div>
    </div>
  );
}
