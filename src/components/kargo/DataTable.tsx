import { useMemo, useState, type ReactNode } from "react";
import { Search, Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  selectedRowId?: string;
  actions?: ReactNode;
  empty?: string;
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  searchKeys,
  searchPlaceholder = "Buscar…",
  onRowClick,
  selectedRowId,
  actions,
  empty = "Sin resultados.",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    const keys = searchKeys ?? (Object.keys(rows[0] ?? {}) as (keyof T)[]);
    return rows.filter((r) =>
      keys.some((k) => String(r[k] ?? "").toLowerCase().includes(q))
    );
  }, [rows, search, searchKeys]);

  return (
    <div className="kargo-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3">
        <div className="text-sm font-semibold">
          {filtered.length} resultados
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-8 w-56 pl-8 text-xs"
            />
          </div>
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
            <Filter size={13} /> Filtrar
          </Button>
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
            <Download size={13} /> Exportar
          </Button>
          {actions}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`px-5 py-2 ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-muted/30 ${onRowClick ? "cursor-pointer" : ""} ${selectedRowId === row.id ? "bg-primary/5" : ""}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`px-5 py-2 ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""} ${c.className ?? ""}`}
                  >
                    {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-muted-foreground">
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
