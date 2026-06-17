import { createFileRoute } from "@tanstack/react-router";
import { useKargo } from "@/lib/kargo/store";
import { DataTable } from "@/components/kargo/DataTable";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";
import type { Documento } from "@/lib/kargo/types";

export const Route = createFileRoute("/_kargo/merchant/documentos")({
  head: () => ({ meta: [{ title: "Documentos · Merchant · KARGO" }] }),
  component: DocumentosPage,
});

function downloadDoc(d: Documento) {
  const content = `${d.tipo.toUpperCase()} — ${d.otId}\nFecha: ${d.fecha}\nArchivo: ${d.nombre}\n\n(Documento simulado)\n`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = d.nombre.replace(/\.pdf$/, ".txt");
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`${d.nombre} descargado`);
}

function DocumentosPage() {
  const documentos = useKargo((s) => s.documentos);

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
          <FileText size={12} /> Merchant
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Documentos y custodia</h1>
        <p className="text-sm text-muted-foreground">PODs, manifiestos y guías de despacho.</p>
      </div>

      <DataTable
        rows={documentos}
        searchKeys={["id", "otId", "nombre", "tipo"]}
        searchPlaceholder="Buscar documento, OT…"
        columns={[
          { key: "id", label: "ID", render: (d) => <span className="font-mono text-xs text-muted-foreground">{d.id}</span> },
          { key: "otId", label: "OT", render: (d) => <span className="font-mono text-xs font-semibold text-primary">{d.otId}</span> },
          { key: "tipo", label: "Tipo", render: (d) => <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{d.tipo}</span> },
          { key: "nombre", label: "Archivo" },
          { key: "fecha", label: "Fecha", render: (d) => <span className="text-muted-foreground">{d.fecha}</span> },
          {
            key: "acciones", label: "", align: "right",
            render: (d) => <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={() => downloadDoc(d)}><Download size={12} /> Descargar</Button>,
          },
        ]}
      />
    </div>
  );
}
