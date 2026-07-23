import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface ScreenContainerProps extends HTMLAttributes<HTMLElement> {
  /** Render as `<main>` by default for landmark semantics. */
  as?: "main" | "section" | "div";
  /** Apply horizontal screen padding (20px). */
  padded?: boolean;
  /** Center content and cap width at 480px for mobile-first layouts. */
  constrained?: boolean;
  /** Include safe-area padding for notched devices. */
  safeArea?: boolean;
  children: ReactNode;
}

/**
 * Mobile-first page wrapper with consistent horizontal padding and max width.
 * Use as the outermost layout element on every screen.
 */
export function ScreenContainer({
  as: Component = "main",
  padded = true,
  constrained = true,
  safeArea = true,
  className,
  children,
  ...props
}: ScreenContainerProps) {
  return (
    <Component
      className={cn(
        "flex w-full flex-1 flex-col",
        padded && "px-5",
        constrained && "mx-auto w-full max-w-[var(--spacing-content-max)]",
        safeArea && "pt-safe pb-safe",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
