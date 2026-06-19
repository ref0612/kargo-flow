import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKargo } from "@/lib/kargo/store";
import { LEGACY_TO_OT_STATE, normalizeOTEstado, type OTState } from "@/lib/kargo/types";

export const Route = createFileRoute("/_kargo/coord-op/kanban")({
  head: () => ({ meta: [{ title: "Kanban · Coord. Operador · KARGO" }] }),
  component: KanbanPage,
});

type KanbanOrder = {
  id: string;
  trackingNumber: string;
  state: OTState;
  originZone: string;
  destinationZone: string;
  incidencias?: string[];
};

const COLUMNS: { key: string; title: string; matcher: (o: KanbanOrder) => boolean }[] = [
  {
    key: "por-asignar",
    title: "Por Asignar",
    matcher: (o) => o.state === "100_CREADA_POR_ASIGNAR",
  },
  {
    key: "asignadas-driver1",
    title: "Asignadas (Driver 1)",
    matcher: (o) => ["200_ASIGNADA", "150_REASIGNADA", "300_RECOLECTADA"].includes(o.state),
  },
  {
    key: "bodega-origen",
    title: "En Bodega Origen",
    matcher: (o) => ["400_RECIBIDA_WAREHOUSE_1", "450_PENDIENTE_ASIGNACION_BUS"].includes(o.state),
  },
  {
    key: "en-transito",
    title: "En Tránsito",
    matcher: (o) => o.state === "500_EN_TRANSITO",
  },
  {
    key: "destino-ultima-milla",
    title: "En Destino / Última Milla",
    matcher: (o) => ["600_RECIBIDA_WAREHOUSE_2", "700A_DISPONIBLE_PARA_RETIRO", "700B_EN_DISTRIBUCION_LOCAL"].includes(o.state),
  },
  {
    key: "incidencias",
    title: "Incidencias",
    matcher: (o) => o.state === "950_SUSPENDIDA" || Boolean(o.incidencias?.length),
  },
];

function KanbanPage() {
  const ots = useKargo((s) => s.ots);

  const orders: KanbanOrder[] = ots.map((ot) => {
    const legacyState = normalizeOTEstado(ot.estado);
    const strictState = LEGACY_TO_OT_STATE[legacyState === "incidencia" ? "suspendida" : legacyState];
    const incidencias = (ot as unknown as { incidencias?: string[] }).incidencias;

    return {
      id: ot.id,
      trackingNumber: ot.id,
      state: strictState,
      originZone: ot.origen,
      destinationZone: ot.destino,
      incidencias,
    };
  });

  const columns = COLUMNS.map((column) => ({
    ...column,
    orders: orders.filter(column.matcher),
  }));

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">Coord. Operador</div>
        <h1 className="text-2xl font-semibold tracking-tight">Visibilidad Global (Kanban)</h1>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {columns.map((column) => {
          return (
            <Card key={column.key} className="min-h-[520px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm font-semibold">{column.title}</CardTitle>
                  <Badge variant="secondary" className="tabular-nums">{column.orders.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {column.orders.map((order) => (
                  <Card key={order.id} className="border-border/80">
                    <CardContent className="space-y-2 p-3 text-xs">
                      <div className="font-mono font-semibold text-primary">{order.trackingNumber}</div>
                      <div className="text-muted-foreground">Origen: {order.originZone}</div>
                      <div className="text-muted-foreground">Destino: {order.destinationZone}</div>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="outline">{order.state.split("_")[0]}</Badge>
                        {order.incidencias?.map((inc) => (
                          <Badge key={`${order.id}-${inc}`} variant="destructive">{inc}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {column.orders.length === 0 && <p className="py-8 text-center text-xs text-muted-foreground">Sin órdenes</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
