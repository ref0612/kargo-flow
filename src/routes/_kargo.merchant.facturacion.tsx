import { createFileRoute } from "@tanstack/react-router";
import { useKargo } from "@/lib/kargo/store";
import { KpiCard } from "@/components/kargo/KpiCard";
import { Button } from "@/components/ui/button";
import { Receipt, Download, DollarSign, Package } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_kargo/merchant/facturacion")({
  head: () => ({ meta: [{ title: "Facturación · Merchant · KARGO" }] }),
  component: FacturacionPage,
});

function FacturacionPage() {
  const ots = useKargo((s) => s.ots);
  const facturables = ots.filter((o) => o.estado === "finalizada");
  const tarifaPorBulto = 800;
  const totalBultos = facturables.reduce((acc, o) => acc + o.bultos, 0);
  const subtotal = totalBultos * tarifaPorBulto;
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  const descargar = () => {
    const lines = [
      "FACTURA MENSUAL — KARGO",
      `Merchant: Falabella`,
      `Periodo: Mayo 2025`,
      "",
      ...facturables.map((o) => `  ${o.id}  ${o.origen} → ${o.destino}  ${o.bultos} bultos  $${(o.bultos * tarifaPorBulto).toLocaleString("es-CL")}`),
      "",
      `Subtotal: $${subtotal.toLocaleString("es-CL")}`,
      `IVA 19%: $${iva.toLocaleString("es-CL")}`,
      `TOTAL: $${total.toLocaleString("es-CL")}`,
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "factura-mayo-2025.txt"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Factura descargada");
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5"><Receipt size={12} /> Merchant</div>
          <h1 className="text-2xl font-semibold tracking-tight">Facturación mensual</h1>
          <p className="text-sm text-muted-foreground">Periodo: Mayo 2025</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={descargar}><Download size={14} /> Descargar factura</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <KpiCard label="OTs facturables" value={facturables.length} icon={<Package />} tone="primary" />
        <KpiCard label="Bultos totales" value={totalBultos} icon={<Package />} tone="primary" />
        <KpiCard label="Subtotal" value={`$${subtotal.toLocaleString("es-CL")}`} icon={<DollarSign />} tone="success" />
        <KpiCard label="Total + IVA" value={`$${total.toLocaleString("es-CL")}`} icon={<DollarSign />} tone="success" />
      </div>

      <div className="kargo-card p-5">
        <div className="mb-3 text-sm font-semibold">Detalle</div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b">
            <tr><th className="py-2 text-left">OT</th><th className="py-2 text-left">Ruta</th><th className="py-2 text-right">Bultos</th><th className="py-2 text-right">Monto</th></tr>
          </thead>
          <tbody className="divide-y">
            {facturables.map((o) => (
              <tr key={o.id}>
                <td className="py-2 font-mono text-xs font-semibold text-primary">{o.id}</td>
                <td className="py-2 text-muted-foreground">{o.origen} → {o.destino}</td>
                <td className="py-2 text-right tabular-nums">{o.bultos}</td>
                <td className="py-2 text-right tabular-nums">${(o.bultos * tarifaPorBulto).toLocaleString("es-CL")}</td>
              </tr>
            ))}
            {!facturables.length && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Sin OTs facturables aún.</td></tr>
            )}
          </tbody>
          <tfoot className="border-t">
            <tr><td colSpan={3} className="py-2 text-right font-medium">Subtotal</td><td className="py-2 text-right tabular-nums">${subtotal.toLocaleString("es-CL")}</td></tr>
            <tr><td colSpan={3} className="py-2 text-right font-medium">IVA 19%</td><td className="py-2 text-right tabular-nums">${iva.toLocaleString("es-CL")}</td></tr>
            <tr><td colSpan={3} className="py-2 text-right font-bold">TOTAL</td><td className="py-2 text-right tabular-nums font-bold text-primary">${total.toLocaleString("es-CL")}</td></tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
