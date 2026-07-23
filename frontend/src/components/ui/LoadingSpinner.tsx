import { cn } from "@/lib/utils";

export type LoadingSpinnerSize = "sm" | "md" | "lg";

export interface LoadingSpinnerProps {
  /** Accessible label announced to screen readers. */
  label?: string;
  /** Visual size preset. */
  size?: LoadingSpinnerSize;
  /** Spinner color variant. */
  variant?: "primary" | "inverse";
  className?: string;
}

const sizeStyles: Record<LoadingSpinnerSize, string> = {
  sm: "size-4 border-2",
  md: "size-5 border-2",
  lg: "size-8 border-[3px]",
};

const variantStyles = {
  primary: "border-primary-200 border-t-primary-500",
  inverse: "border-white/30 border-t-white",
};

/**
 * Accessible loading indicator with a calm, minimal spin animation.
 * Use inside buttons (sm) or full-screen loading states (lg).
 */
export function LoadingSpinner({
  label = "Loading",
  size = "md",
  variant = "primary",
  className,
}: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "animate-spin rounded-full",
          sizeStyles[size],
          variantStyles[variant],
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
