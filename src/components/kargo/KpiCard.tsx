import React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export interface KpiProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function KpiCard({ title, value, icon, trend, trendValue }: KpiProps) {
  return (
    <div className="rounded-xl border bg-white text-card-foreground shadow-sm p-5 flex flex-col gap-3 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="tracking-tight text-sm font-medium text-slate-500">{title}</h3>
        <div className="p-2 bg-slate-50 rounded-lg">
          {icon}
        </div>
      </div>
      
      <div className="text-3xl font-bold text-slate-800">{value}</div>
      
      {trend && trendValue && (
        <div className={`flex items-center text-xs font-medium ${
          trend === 'up' ? 'text-emerald-600' : 
          trend === 'down' ? 'text-rose-600' : 
          'text-slate-500'
        }`}>
          {trend === 'up' && <ArrowUpRight className="mr-1 h-3.5 w-3.5" />}
          {trend === 'down' && <ArrowDownRight className="mr-1 h-3.5 w-3.5" />}
          {trendValue}
        </div>
      )}
    </div>
  );
}