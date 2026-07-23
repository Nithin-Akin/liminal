"use client";

import { Mail } from "lucide-react";
import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

export interface EmailInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

/**
 * Email field with a minimal envelope icon.
 * Matches PasswordInput styling for auth form consistency.
 */
export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  function EmailInput(
    { label, error, helperText, className, id, disabled, ...props },
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
          className="text-label-md font-medium text-text-primary"
        >
          {label}
        </label>

        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-text-muted"
            strokeWidth={1.75}
          />

          <input
            ref={ref}
            id={inputId}
            type="email"
            inputMode="email"
            autoComplete="email"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "min-h-12 w-full rounded-md border bg-surface-primary py-3 pl-11 pr-4 text-body-md text-text-primary",
              "placeholder:text-text-muted",
              "transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
              "focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-xs",
              "disabled:cursor-not-allowed disabled:bg-bg-muted disabled:text-text-disabled",
              error
                ? "border-error"
                : "border-border-default hover:border-primary-200",
              className,
            )}
            {...props}
          />
        </div>

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
  },
);

EmailInput.displayName = "EmailInput";
