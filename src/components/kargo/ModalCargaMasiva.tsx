import { useMemo, useState } from "react";
import { Upload, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Row {
  origen: string;
  destino: string;
  bultos: number;
  merchant?: string;
  _errors: string[];
}

const SAMPLE = `origen,destino,bultos,merchant
CD Pudahuel,Temuco,15,Falabella
Las Condes,Concepción,8,Falabella
Vitacura,Arica,32,Ripley`;

const DESTINOS_OK = new Set(["Temuco", "Concepción", "Valparaíso", "Arica", "Puerto Montt", "La Serena", "Iquique", "Antofagasta", "Rancagua", "Chillán"]);

export function ModalCargaMasiva({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: (rows: Array<{ origen: string; destino: string; bultos: number; merchant?: string }>) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [text, setText] = useState(SAMPLE);

  const rows = useMemo<Row[]>(() => {
    if (!text.trim()) return [];
    const lines = text.trim().split(/\r?\n/);
    const dataLines = lines[0]?.toLowerCase().includes("origen") ? lines.slice(1) : lines;
    return dataLines.map((line) => {
      const [origen = "", destino = "", bultosRaw = "", merchant] = line.split(",").map((s) => s.trim());
      const bultos = parseInt(bultosRaw || "0");
      const errors: string[] = [];
      if (!origen) errors.push("origen vacío");
      if (!destino) errors.push("destino vacío");
      if (!bultos || bultos < 1) errors.push("bultos inválidos");
      if (destino && !DESTINOS_OK.has(destino)) errors.push(`destino "${destino}" no soportado`);
      return { origen, destino, bultos, merchant: merchant || "Falabella", _errors: errors };
    });
  }, [text]);

  const validRows = rows.filter((r) => r._errors.length === 0);
  const errorCount = rows.length - validRows.length;

  const reset = () => { setStep(1); setText(SAMPLE); };
  const close = () => { onOpenChange(false); setTimeout(reset, 200); };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) close(); else onOpenChange(true); }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload size={16} /> Carga Masiva de OTs
          </DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center gap-2 text-xs">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex flex-1 items-center gap-2">
              <div className={`grid size-6 place-items-center rounded-full text-[11px] font-semibold ${step >= n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{n}</div>
              <span className={step >= n ? "font-medium text-foreground" : "text-muted-foreground"}>
                {n === 1 ? "Subir CSV" : n === 2 ? "Validar" : "Confirmar"}
              </span>
              {n < 3 && <div className={`mx-2 h-0.5 flex-1 ${step > n ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">
              Pega tu CSV con columnas <code className="rounded bg-muted px-1">origen, destino, bultos, merchant</code>.
            </div>
            <Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} className="font-mono text-xs" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-success"><CheckCircle2 size={14} /> {validRows.length} válidas</span>
              {errorCount > 0 && <span className="flex items-center gap-1.5 text-destructive"><AlertCircle size={14} /> {errorCount} con errores</span>}
            </div>
            <div className="max-h-72 overflow-auto rounded-md border">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr><th className="px-3 py-1.5 text-left">#</th><th className="px-3 py-1.5 text-left">Origen</th><th className="px-3 py-1.5 text-left">Destino</th><th className="px-3 py-1.5 text-right">Bultos</th><th className="px-3 py-1.5 text-left">Merchant</th><th className="px-3 py-1.5 text-left">Estado</th></tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((r, i) => (
                    <tr key={i} className={r._errors.length ? "bg-destructive/5" : ""}>
                      <td className="px-3 py-1.5 text-muted-foreground">{i + 1}</td>
                      <td className="px-3 py-1.5">{r.origen}</td>
                      <td className="px-3 py-1.5">{r.destino}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{r.bultos}</td>
                      <td className="px-3 py-1.5">{r.merchant}</td>
                      <td className="px-3 py-1.5">
                        {r._errors.length ? (
                          <span className="text-destructive">{r._errors.join(", ")}</span>
                        ) : (
                          <span className="text-success">OK</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 text-sm">
            <div className="rounded-md bg-primary/5 p-4">
              Se crearán <strong>{validRows.length}</strong> OTs. Las filas con errores serán ignoradas.
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 max-h-48 overflow-auto">
              {validRows.slice(0, 10).map((r, i) => (
                <li key={i}>• {r.origen} → {r.destino} ({r.bultos} bultos)</li>
              ))}
              {validRows.length > 10 && <li>… y {validRows.length - 10} más</li>}
            </ul>
          </div>
        )}

        <DialogFooter>
          {step > 1 && <Button variant="outline" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}>Atrás</Button>}
          {step < 3 && (
            <Button onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)} disabled={step === 2 && validRows.length === 0}>
              Siguiente <ArrowRight size={14} className="ml-1" />
            </Button>
          )}
          {step === 3 && (
            <Button onClick={() => { onConfirm(validRows.map(({ _errors, ...r }) => r)); close(); }} disabled={validRows.length === 0}>
              Crear {validRows.length} OTs
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
