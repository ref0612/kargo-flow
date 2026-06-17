import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RoleSidebarItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
}

export function RoleSidebar({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: RoleSidebarItem[];
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden w-56 shrink-0 border-r bg-card md:flex md:flex-col">
      <div className="border-b px-4 py-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{title}</div>
        {subtitle && <div className="mt-0.5 text-sm font-semibold text-foreground">{subtitle}</div>}
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        {items.map((it) => {
          const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to + "/"));
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                active
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={15} />
              <span className="flex-1">{it.label}</span>
              {it.badge !== undefined && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
                    active ? "bg-white/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  {it.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
