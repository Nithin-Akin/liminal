"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  helperText?: string;
}

/**
 * Password field with visibility toggle.
 * Matches shared Input styling while adding auth-specific behaviour.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    { label, error, helperText, className, id, disabled, ...props },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
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
          <Lock
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-text-muted"
            strokeWidth={1.75}
          />

          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            autoComplete="current-password"
            className={cn(
              "min-h-12 w-full rounded-md border bg-surface-primary py-3 pl-11 pr-12 text-body-md text-text-primary",
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

          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            disabled={disabled}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className={cn(
              "absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center",
              "rounded-r-md text-text-muted transition-colors",
              "hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500",
              "disabled:pointer-events-none",
            )}
          >
            {visible ? (
              <EyeOff aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
            ) : (
              <Eye aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
            )}
          </button>
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

PasswordInput.displayName = "PasswordInput";
