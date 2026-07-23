"use client";

import type { KeyboardEvent } from "react";
import type { LucideIcon } from "lucide-react";

import { Card } from "@/components";
import { cn } from "@/lib/utils";

export interface QuestionOptionRowProps {
  icon: LucideIcon;
  label: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

/**
 * Single answer row within the Questionnaire — full-width, icon-leading.
 * Mirrors TransitionTypeCard's selection semantics in a horizontal layout.
 */
export function QuestionOptionRow({
  icon: Icon,
  label,
  selected,
  onSelect,
  disabled = false,
}: QuestionOptionRowProps) {
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
      role="radio"
      aria-checked={selected}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex flex-row items-center gap-4 py-4",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
          selected
            ? "bg-primary-500 text-text-inverse"
            : "bg-bg-subtle text-secondary-700",
        )}
      >
        <Icon aria-hidden="true" size={18} strokeWidth={1.75} />
      </span>

      <span className="text-body-md font-medium text-text-primary">
        {label}
      </span>
    </Card>
  );
}
