import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  variant?: "default" | "orange" | "yellow" | "purple" | "mint" | "blue" | "dark";
  className?: string;
  onClick?: () => void;
}

const variants = {
  default: "bg-bg-card border border-border text-text-muted",
  orange: "bg-orange/20 text-orange border border-orange/30",
  yellow: "bg-yellow/20 text-yellow border border-yellow/30",
  purple: "bg-purple/20 text-purple border border-purple/30",
  mint: "bg-mint/20 text-mint border border-mint/30",
  blue: "bg-blue/20 text-blue border border-blue/30",
  dark: "bg-bg-elevated border border-border text-text-muted",
};

export function Chip({ children, variant = "default", className, onClick }: ChipProps) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-95",
        variants[variant],
        className
      )}
    >
      {children}
    </Tag>
  );
}
