import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownPillProps {
  label: string;
  className?: string;
}

export function DropdownPill({ label, className }: DropdownPillProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-card px-3 py-1.5 text-xs font-semibold text-text-muted transition hover:border-border-light hover:text-text",
        className
      )}
    >
      {label}
      <ChevronDown className="h-3 w-3 opacity-60" />
    </button>
  );
}
