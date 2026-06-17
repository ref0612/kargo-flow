import { cn } from "@/lib/utils";
import type { OTEstado } from "@/lib/kargo/types";

const STEPS: { key: OTEstado; label: string }[] = [
  { key: "creada", label: "Creada" },
  { key: "asignada", label: "Asignada" },
  { key: "recolectada", label: "Recolección" },
  { key: "wh1", label: "WH1" },
  { key: "en-transito", label: "En tránsito" },
  { key: "finalizada", label: "Entregada" },
];

const ORDER: OTEstado[] = ["creada", "asignada", "recolectada", "wh1", "en-transito", "finalizada"];

export function StepBar({ estado }: { estado: OTEstado }) {
  const idx = Math.max(0, ORDER.indexOf(estado));
  return (
    <div className="flex items-center gap-1 overflow-x-auto px-5 py-4">
      {STEPS.map((s, i) => {
        const stepIdx = ORDER.indexOf(s.key);
        const reached = stepIdx <= idx;
        const active = stepIdx === idx;
        return (
          <div key={s.key} className="flex flex-1 items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "grid size-7 place-items-center rounded-full text-[11px] font-semibold transition",
                  reached ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  active && "ring-4 ring-primary/20"
                )}
              >
                {i + 1}
              </div>
              <span className={cn("whitespace-nowrap text-[10px]", reached ? "text-foreground" : "text-muted-foreground")}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("mb-4 h-0.5 flex-1", reached ? "bg-primary" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
