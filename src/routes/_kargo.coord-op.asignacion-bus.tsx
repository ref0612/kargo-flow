import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useKargo } from "@/lib/kargo/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StateBadge } from "@/components/kargo/StateBadge";
import { Bus } from "lucide-react";
import { toast } from "sonner";
import type { OT } from "@/lib/kargo/types";

export const Route = createFileRoute("/_kargo/coord-op/asignacion-bus")({
  head: () => ({ meta: [{ title: "Asignación Bus · Coord. Operador · KARGO" }] }),
  component: AsignacionBusPage,
});

function AsignacionBusPage() {
  const ots = useKargo((s) => s.ots);
  const buses = useKargo((s) => s.buses).filter((b) => b.estado === "disponible");
  const drivers2 = useKargo((s) => s.drivers).filter((d) => d.tipo === "D2" && d.estado === "disponible");
  const asignar = useKargo((s) => s.asignarBus);
  const [target, setTarget] = useState<OT | null>(null);
  const [bus, setBus] = useState(buses[0]?.patente ?? "");
  const [d2, setD2] = useState(drivers2[0]?.nombre ?? "");
  const wh1 = ots.filter((o) => o.estado === "wh1");

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">Coord. Operador</div>
        <h1 className="text-2xl font-semibold tracking-tight">Asignación de Bus & Driver 2</h1>
      </div>

      <div className="kargo-card">
        <div className="border-b px-5 py-3 text-sm font-semibold">OTs en WH1 ({wh1.length})</div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-5 py-2 text-left">OT</th><th className="px-5 py-2 text-left">Merchant</th><th className="px-5 py-2 text-left">Destino</th><th className="px-5 py-2 text-right">Bultos</th><th className="px-5 py-2 text-left">Estado</th><th></th></tr>
          </thead>
          <tbody className="divide-y">
            {wh1.map((o) => (
              <tr key={o.id} className="hover:bg-muted/30">
                <td className="px-5 py-2 font-mono text-xs font-semibold text-primary">{o.id}</td>
                <td className="px-5 py-2">{o.merchant}</td>
                <td className="px-5 py-2">{o.destino}</td>
                <td className="px-5 py-2 text-right tabular-nums">{o.bultos}</td>
                <td className="px-5 py-2"><StateBadge estado={o.estado} /></td>
                <td className="px-5 py-2 text-right">
                  <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={() => setTarget(o)}><Bus size={12} /> Asignar</Button>
                </td>
              </tr>
            ))}
            {!wh1.length && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No hay OTs en WH1.</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Asignar bus a {target?.id}</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Bus / patente</div>
              <Select value={bus} onValueChange={setBus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{buses.map((b) => <SelectItem key={b.id} value={b.patente}>{b.patente} · {b.modelo}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Driver 2</div>
              <Select value={d2} onValueChange={setD2}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{drivers2.map((d) => <SelectItem key={d.id} value={d.nombre}>{d.nombre}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { if (target) { asignar(target.id, bus, d2); toast.success(`Bus ${bus} asignado`); setTarget(null); } }}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
