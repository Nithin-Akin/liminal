import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type CardVariant = "default" | "tinted" | "accent";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Surface style preset. */
  variant?: CardVariant;
  /** Internal padding scale. */
  padding?: CardPadding;
  /** Adds interactive hover/active styles for selectable cards. */
  interactive?: boolean;
  /** Selected state for interactive cards (e.g. transition selection). */
  selected?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: "border-border-subtle bg-surface-primary",
  tinted: "border-primary-200 bg-surface-tinted",
  accent: "border-accent-200 bg-surface-accent",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

/**
 * Content container for grouped information — tasks, transitions, AI responses.
 * Use `interactive` + `selected` for tappable selection cards.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = "default",
    padding = "md",
    interactive = false,
    selected = false,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <div
      ref={ref}
      data-selected={selected || undefined}
      className={cn(
        "rounded-lg border shadow-xs",
        variantStyles[variant],
        paddingStyles[padding],
        interactive &&
          "cursor-pointer transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-primary-200 hover:bg-primary-50 active:bg-primary-100",
        selected && "border-2 border-border-focus bg-primary-50 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";
