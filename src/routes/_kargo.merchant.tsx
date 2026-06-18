import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard, ListOrdered, MapPin, FileText, BarChart3, AlertTriangle, Undo2, Receipt,
} from "lucide-react";
import { RoleSidebar, type RoleSidebarItem } from "@/components/kargo/RoleSidebar";

export const Route = createFileRoute("/_kargo/merchant")({
  component: MerchantLayout,
});

const items: RoleSidebarItem[] = [
  { to: "/merchant", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/merchant/ordenes", label: "Órdenes", icon: ListOrdered },
  { to: "/merchant/seguimiento", label: "Seguimiento", icon: MapPin },
  { to: "/merchant/documentos", label: "Documentos", icon: FileText },
  { to: "/merchant/reportes", label: "Reportes / SLA", icon: BarChart3 },
  { to: "/merchant/incidencias", label: "Incidencias", icon: AlertTriangle },
  { to: "/merchant/devoluciones", label: "Devoluciones", icon: Undo2 },
  { to: "/merchant/facturacion", label: "Facturación", icon: Receipt },
];

function MerchantLayout() {
  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      <RoleSidebar title="Merchant" subtitle="Falabella" items={items} />
      <div className="flex-1 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
