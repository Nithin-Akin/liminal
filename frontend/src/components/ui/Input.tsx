import { forwardRef, type InputHTMLAttributes, useId } from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label rendered above the field. Required for accessibility. */
  label: string;
  /** Supporting text below the field. */
  helperText?: string;
  /** Error message — also sets aria-invalid and error styling. */
  error?: string;
  /** Visually hide the label while keeping it available to screen readers. */
  hideLabel?: boolean;
}

/**
 * Accessible text input aligned with the Liminal design system.
 * Always pair with a visible or visually-hidden label — never placeholder-only.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    error,
    hideLabel = false,
    className,
    id,
    disabled,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy =
    [errorId, !error ? helperId : undefined].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={inputId}
        className={cn(
          "text-label-md font-medium text-text-primary",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </label>

      <input
        ref={ref}
        id={inputId}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "min-h-12 w-full rounded-md border bg-surface-primary px-4 py-3 text-body-md text-text-primary",
          "placeholder:text-text-muted",
          "transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
          "focus-visible:border-border-focus focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-xs",
          "disabled:cursor-not-allowed disabled:bg-bg-muted disabled:text-text-disabled",
          error
            ? "border-error"
            : "border-border-default hover:border-primary-200",
          className,
        )}
        {...props}
      />

      {error ? (
        <p id={errorId} role="alert" className="text-body-sm text-error">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-body-sm text-text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = "Input";
