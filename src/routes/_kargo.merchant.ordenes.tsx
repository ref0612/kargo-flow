import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useKargo } from "@/lib/kargo/store";
import { DataTable } from "@/components/kargo/DataTable";
import { StateBadge } from "@/components/kargo/StateBadge";
import { ModalCargaMasiva } from "@/components/kargo/ModalCargaMasiva";
import { Button } from "@/components/ui/button";
import { Upload, ListOrdered } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_kargo/merchant/ordenes")({
  head: () => ({ meta: [{ title: "Órdenes · Merchant · KARGO" }] }),
  component: OrdenesPage,
});

function OrdenesPage() {
  const ots = useKargo((s) => s.ots);
  const cargaMasiva = useKargo((s) => s.cargaMasivaOTs);
  const [openMasiva, setOpenMasiva] = useState(false);

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <ListOrdered size={12} /> Merchant
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Todas las órdenes</h1>
          <p className="text-sm text-muted-foreground">Listado completo con búsqueda, filtros y exportación.</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setOpenMasiva(true)}>
          <Upload size={14} /> Carga masiva
        </Button>
      </div>

      <DataTable
        rows={ots}
        searchKeys={["id", "destino", "origen", "merchant"]}
        searchPlaceholder="Buscar OT, destino, merchant…"
        columns={[
          { key: "id", label: "OT", render: (o) => <span className="font-mono text-xs font-semibold text-primary">{o.id}</span> },
          { key: "merchant", label: "Merchant" },
          { key: "origen", label: "Origen" },
          { key: "destino", label: "Destino" },
          { key: "estado", label: "Estado", render: (o) => <StateBadge estado={o.estado} /> },
          { key: "creada", label: "Creada", render: (o) => <span className="text-muted-foreground">{o.creada}</span> },
          { key: "bultos", label: "Bultos", align: "right", render: (o) => <span className="tabular-nums">{o.bultos}</span> },
        ]}
      />

      <ModalCargaMasiva
        open={openMasiva}
        onOpenChange={setOpenMasiva}
        onConfirm={(rows) => {
          const c = cargaMasiva(rows);
          toast.success(`${c.length} OTs creadas`);
        }}
      />
    </div>
  );
}
