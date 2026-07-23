"use client";

import type { KeyboardEvent } from "react";
import type { LucideIcon } from "lucide-react";

import { Card } from "@/components";
import { cn } from "@/lib/utils";

export interface TransitionTypeCardProps {
  icon: LucideIcon;
  label: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

/**
 * Single tappable option in the Transition Selection grid.
 * Wraps Card's interactive/selected states and adds keyboard support
 * since selection here is the primary way to advance onboarding.
 */
export function TransitionTypeCard({
  icon: Icon,
  label,
  selected,
  onSelect,
  disabled = false,
}: TransitionTypeCardProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  }

  return (
    <Card
      variant={selected ? "tinted" : "default"}
      interactive={!disabled}
      selected={selected}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-6 text-center",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <span
        className={cn(
          "flex size-11 items-center justify-center rounded-full transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
          selected
            ? "bg-primary-500 text-text-inverse"
            : "bg-bg-subtle text-secondary-700",
        )}
      >
        <Icon aria-hidden="true" size={20} strokeWidth={1.75} />
      </span>

      <span className="text-label-md font-medium text-text-primary">
        {label}
      </span>
    </Card>
  );
}
