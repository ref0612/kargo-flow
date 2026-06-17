import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useKargo } from "@/lib/kargo/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollText, Search, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_kargo/coord-op/logs")({
  head: () => ({ meta: [{ title: "Logs · Coord. Operador · KARGO" }] }),
  component: LogsPage,
});

function LogsPage() {
  const log = useKargo((s) => s.log);
  const [q, setQ] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const filtered = useMemo(() => {
    if (!q) return log;
    const s = q.toLowerCase();
    return log.filter((e) => e.msg.toLowerCase().includes(s) || (e.otId ?? "").toLowerCase().includes(s));
  }, [log, q]);

  const exportar = () => {
    const txt = filtered.map((e) => `${e.time}\t${e.otId ?? "—"}\t${e.msg}`).join("\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "kargo-logs.txt"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Logs exportados");
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5"><ScrollText size={12} /> Coord. Operador</div>
          <h1 className="text-2xl font-semibold tracking-tight">Logs de actividad</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrar…" className="h-8 w-64 pl-8 text-xs" />
          </div>
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs" onClick={exportar}><Download size={13} /> Exportar</Button>
        </div>
      </div>

      <div className="kargo-card">
        <table className="w-full text-xs font-mono">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr><th className="px-4 py-2 text-left w-28">Hora</th><th className="px-4 py-2 text-left w-28">OT</th><th className="px-4 py-2 text-left">Mensaje</th></tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((e, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <td suppressHydrationWarning className="px-4 py-1.5 tabular-nums text-muted-foreground">{mounted ? e.time : "--:--:--"}</td>
                <td className="px-4 py-1.5 text-primary">{e.otId ?? "—"}</td>
                <td className="px-4 py-1.5">{e.msg}</td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">Sin entradas.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
