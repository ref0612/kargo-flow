import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard, UserCheck, Bus, Kanban, IdCard, Map, BellRing, AlertTriangle, Truck, ScrollText,
} from "lucide-react";
import { RoleSidebar, type RoleSidebarItem } from "@/components/kargo/RoleSidebar";

export const Route = createFileRoute("/_kargo/coord-op")({
  component: CoordOpLayout,
});

const items: RoleSidebarItem[] = [
  { to: "/coord-op", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/coord-op/asignacion", label: "Asignación D1", icon: UserCheck },
  { to: "/coord-op/asignacion-bus", label: "Asignación Bus", icon: Bus },
  { to: "/coord-op/kanban", label: "Kanban", icon: Kanban },
  { to: "/coord-op/drivers", label: "Drivers", icon: IdCard },
  { to: "/coord-op/buses", label: "Buses / Flota", icon: Truck },
  { to: "/coord-op/mapa", label: "Mapa operacional", icon: Map },
  { to: "/coord-op/alertas", label: "Alertas", icon: BellRing },
  { to: "/coord-op/incidencias", label: "Incidencias", icon: AlertTriangle },
  { to: "/coord-op/logs", label: "Logs", icon: ScrollText },
];

function CoordOpLayout() {
  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      <RoleSidebar title="Coord. Operador" subtitle="Op. RM Centro" items={items} />
      <div className="flex-1 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
