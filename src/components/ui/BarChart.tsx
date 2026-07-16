"use client";

import { cn } from "@/lib/utils";

interface BarChartProps {
  data: { label: string; value: number; highlight?: boolean }[];
  className?: string;
  barClassName?: string;
}

export function BarChart({ data, className, barClassName }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className={cn("flex items-end justify-between gap-2", className)}>
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div
            className={cn(
              "w-full rounded-t-xl transition-all",
              item.highlight ? "bg-text-dark/80" : "bg-text-dark/30",
              barClassName
            )}
            style={{ height: `${(item.value / max) * 80 + 12}px` }}
          />
          <span className="text-[9px] font-semibold uppercase tracking-wide opacity-70">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
