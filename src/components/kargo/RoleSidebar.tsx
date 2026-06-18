import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarItem {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean; // Permitimos definir si la coincidencia debe ser exacta
}

interface RoleSidebarProps {
  title: string;
  subtitle?: string;
  items: SidebarItem[];
}

export function RoleSidebar({ title, subtitle, items }: RoleSidebarProps) {
  // Estado para colapsar y expandir la barra lateral
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)]">
      <aside
        className={`bg-card border-r flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Cabecera del Sidebar */}
        {!isCollapsed && (
          <div className="p-4 border-b">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              {title}
            </p>
            {subtitle && (
              <p className="text-sm font-bold text-card-foreground mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Enlaces de Navegación */}
        <nav className="flex-1 p-3 space-y-1">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              // Corrección: Si exact es true, evita activar visualmente este botón en rutas hijas
              activeOptions={{ exact: item.exact ?? false }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-muted group whitespace-nowrap ${
                isCollapsed ? "justify-center" : ""
              }`}
              activeProps={{
                className: "bg-primary text-primary-foreground font-medium hover:bg-primary hover:text-primary-foreground",
              }}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Botón para Ocultar / Mostrar la barra lateral */}
        <div className="p-3 border-t flex justify-center">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors w-full flex items-center justify-center gap-2 text-xs font-medium"
            title={isCollapsed ? "Expandir" : "Colapsar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Colapsar menú</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}