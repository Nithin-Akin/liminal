import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  /** Page title — rendered as h1 for route-level semantics. */
  title: string;
  /** Optional subtitle below the title. */
  subtitle?: string;
  /** Use Fraunces display font for emotional screen titles. */
  display?: boolean;
  /** Leading slot — typically a back button. */
  leading?: ReactNode;
  /** Trailing slot — icon button or text action. */
  trailing?: ReactNode;
  /** Sticky header at top of scroll container. */
  sticky?: boolean;
  className?: string;
}

/**
 * Consistent top-of-screen header with title, optional back action, and trailing slot.
 * Back button placement stays top-left across onboarding and app screens.
 */
export function PageHeader({
  title,
  subtitle,
  display = false,
  leading,
  trailing,
  sticky = false,
  className,
}: PageHeaderProps) {
  const hasActions = Boolean(leading || trailing);

  return (
    <header
      className={cn(
        "flex flex-col gap-3 py-4",
        sticky &&
          "sticky top-0 z-10 -mx-5 bg-bg-base/95 px-5 backdrop-blur-sm pt-safe",
        className,
      )}
    >
      {hasActions ? (
        <div className="grid min-h-11 grid-cols-[2.75rem_1fr_2.75rem] items-center">
          <div className="flex items-center justify-start">{leading}</div>
          <div aria-hidden="true" />
          <div className="flex items-center justify-end">{trailing}</div>
        </div>
      ) : null}

      <div>
        <h1
          className={cn(
            display
              ? "font-display text-display-sm font-medium text-text-primary"
              : "text-heading-lg font-semibold text-text-primary",
          )}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-body-md text-text-secondary">{subtitle}</p>
        ) : null}
      </div>
    </header>
  );
}

/**
 * Icon button sized for PageHeader leading/trailing slots.
 * Pair with aria-label when no visible text is present.
 */
export function PageHeaderAction({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-md text-secondary-700",
        "transition-colors duration-[var(--duration-fast)] hover:bg-bg-subtle active:bg-bg-muted",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
