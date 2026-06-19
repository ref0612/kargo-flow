import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarItem {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface RoleSidebarProps {
  title: string;
  subtitle?: string;
  items: SidebarItem[];
}

export function RoleSidebar({ title, subtitle, items }: RoleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)]">
      <aside
        className={`bg-white border-r flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {!isCollapsed && (
          <div className="p-4 border-b bg-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
              {title}
            </p>
            {subtitle && (
              <p className="text-sm font-bold text-foreground mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <nav className="flex-1 p-3 space-y-1">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact ?? false }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-muted group whitespace-nowrap ${
                isCollapsed ? "justify-center" : ""
              }`}
              activeProps={{
                className: "bg-accent text-primary font-semibold hover:bg-accent hover:text-primary",
              }}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t flex justify-center bg-white">
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