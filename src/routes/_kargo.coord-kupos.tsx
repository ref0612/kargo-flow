import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Globe2, Building2, Gauge } from "lucide-react";
import { RoleSidebar, type RoleSidebarItem } from "@/components/kargo/RoleSidebar";

export const Route = createFileRoute("/_kargo/coord-kupos")({
  component: KuposLayout,
});

const items: RoleSidebarItem[] = [
  { to: "/coord-kupos", label: "Enrutamiento", icon: Globe2, exact: true },
  { to: "/coord-kupos/operadores", label: "Operadores", icon: Building2 },
  { to: "/coord-kupos/slas", label: "SLAs Globales", icon: Gauge },
];

function KuposLayout() {
  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      <RoleSidebar title="Coord. Kupos" subtitle="Global" items={items} />
      <div className="flex-1 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
