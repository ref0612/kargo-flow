import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useKargo } from "@/lib/kargo/store";
import { DataTable } from "@/components/kargo/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Undo2, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_kargo/merchant/devoluciones")({
  head: () => ({ meta: [{ title: "Devoluciones · Merchant · KARGO" }] }),
  component: DevolucionesPage,
});

function DevolucionesPage() {
  const devoluciones = useKargo((s) => s.devoluciones);
  const ots = useKargo((s) => s.ots);
  const crear = useKargo((s) => s.crearDevolucion);
  const [open, setOpen] = useState(false);
  const [otId, setOtId] = useState(ots[0]?.id ?? "");
  const [motivo, setMotivo] = useState("");
  const [bultos, setBultos] = useState(1);

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5"><Undo2 size={12} /> Merchant</div>
          <h1 className="text-2xl font-semibold tracking-tight">Devoluciones</h1>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}><Plus size={14} /> Nueva devolución</Button>
      </div>

      <DataTable
        rows={devoluciones}
        searchKeys={["id", "otId", "motivo"]}
        columns={[
          { key: "id", label: "ID", render: (d) => <span className="font-mono text-xs">{d.id}</span> },
          { key: "otId", label: "OT", render: (d) => <span className="font-mono text-xs font-semibold text-primary">{d.otId}</span> },
          { key: "motivo", label: "Motivo" },
          { key: "bultos", label: "Bultos", align: "right" },
          { key: "fecha", label: "Fecha", render: (d) => <span className="text-muted-foreground">{d.fecha}</span> },
          { key: "estado", label: "Estado" },
        ]}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Solicitar devolución</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label>OT</Label>
              <Select value={otId} onValueChange={setOtId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ots.map((o) => <SelectItem key={o.id} value={o.id}>{o.id} — {o.destino}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Bultos</Label><Input type="number" min={1} value={bultos} onChange={(e) => setBultos(parseInt(e.target.value || "1"))} /></div>
            <div><Label>Motivo</Label><Textarea rows={3} value={motivo} onChange={(e) => setMotivo(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => {
              if (!motivo.trim()) return;
              crear({ otId, motivo, bultos, estado: "solicitada" });
              toast.success("Devolución solicitada");
              setMotivo(""); setBultos(1); setOpen(false);
            }}>Solicitar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
