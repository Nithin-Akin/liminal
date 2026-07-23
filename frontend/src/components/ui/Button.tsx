import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "accent"
  | "destructive";

export type ButtonSize = "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant. Only one primary button should appear per viewport. */
  variant?: ButtonVariant;
  /** Size preset — both meet the 44px minimum touch target. */
  size?: ButtonSize;
  /** Shows a spinner and disables interaction while true. */
  isLoading?: boolean;
  /** Optional icon rendered before the label. */
  leftIcon?: ReactNode;
  /** Optional icon rendered after the label. */
  rightIcon?: ReactNode;
  /** Stretch to full container width. */
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-500 text-text-inverse hover:bg-primary-600 active:bg-primary-700",
  secondary:
    "border border-border-default bg-surface-primary text-secondary-700 hover:bg-bg-subtle active:bg-bg-muted",
  ghost:
    "bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100",
  accent:
    "bg-accent-500 text-text-inverse hover:bg-accent-600 active:bg-accent-600",
  destructive:
    "border border-error bg-transparent text-error hover:bg-error/5 active:bg-error/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "min-h-12 px-5 text-label-md",
  lg: "min-h-14 px-6 text-body-md",
};

/**
 * Primary interactive element for actions across Liminal.
 * Supports loading state, icons, and all design-system variants.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium",
          "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
          "active:scale-[0.98] disabled:pointer-events-none disabled:bg-bg-muted disabled:text-text-disabled disabled:active:scale-100",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner
            size="sm"
            variant={variant === "primary" || variant === "accent" ? "inverse" : "primary"}
            label="Loading"
          />
        ) : (
          leftIcon
        )}
        <span className={cn(isLoading && "sr-only")}>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";
