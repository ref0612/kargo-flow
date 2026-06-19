import { Link, useRouterState } from "@tanstack/react-router";
import { Store, Globe2, MapPinned, Truck, PackageCheck, Bus, Wand2, RotateCcw } from "lucide-react";
import { useKargo } from "@/lib/kargo/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ROLES = [
  { to: "/merchant", label: "Merchant", icon: Store, badge: "Falabella" },
  { to: "/coord-kupos", label: "Kupos · Global", icon: Globe2, badge: "Coord" },
  { to: "/coord-op", label: "Operador Zonal", icon: MapPinned, badge: "RM" },
  { to: "/driver1", label: "Driver 1", icon: Truck, badge: "Pickup" },
  { to: "/wh-loader", label: "Loader", icon: PackageCheck, badge: "WH1" },
  { to: "/driver2", label: "Driver 2", icon: Bus, badge: "Bus" },
] as const;

export function MasterBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const generar = useKargo((s) => s.generarFlujoEjemplo);
  const reset = useKargo((s) => s.resetDemo);
  const total = useKargo((s) => s.ots.length);

  return (
    <div className="sticky top-0 z-50 flex h-16 items-center gap-2 overflow-x-auto bg-white border-b px-6 shadow-sm">
      <span className="mr-4 flex items-center gap-1 text-2xl font-black tracking-tight text-primary">
        kargo<span className="text-secondary">.cl</span>
      </span>
      
      <div className="mx-2 h-6 w-px bg-border" />
      
      {ROLES.map((r) => {
        const active = pathname === r.to;
        const Icon = r.icon;
        return (
          <Link
            key={r.to}
            to={r.to}
            className={cn(
              "group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition",
              active ? "bg-accent text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon size={16} /> {r.label}
            <span className={cn("rounded-full px-2 py-0.5 text-[10px]", active ? "bg-primary text-white" : "bg-muted-foreground/20 text-muted-foreground")}>
              {r.badge}
            </span>
          </Link>
        );
      })}
      
      <div className="ml-auto flex items-center gap-3 pl-4">
        <span className="hidden text-xs text-muted-foreground md:inline">{total} OTs activas</span>
        <Button
          size="sm"
          className="h-8 gap-1.5 text-xs rounded-full px-4"
          onClick={() => {
            generar();
            toast.success("Flujo de ejemplo iniciado");
          }}
        >
          <Wand2 size={14} /> Generar flujo
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 text-xs rounded-full px-4"
          onClick={() => {
            reset();
            toast("Demo reiniciado");
          }}
        >
          <RotateCcw size={14} /> Reset
        </Button>
      </div>
    </div>
  );
}