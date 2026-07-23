import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type SecondaryAuthLinkProps = ComponentProps<typeof Link>;

/**
 * Outlined secondary action styled to match the shared Button secondary variant.
 */
export function SecondaryAuthLink({
  className,
  children,
  ...props
}: SecondaryAuthLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-md px-6 text-body-md font-medium",
        "border border-border-default bg-surface-primary text-secondary-700",
        "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
        "hover:bg-bg-subtle active:bg-bg-muted",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
