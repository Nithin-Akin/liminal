import { cn } from "@/lib/utils";

export interface BrandMarkProps {
  className?: string;
}

/**
 * Liminal brand mark — abstract threshold circle with arc motif.
 * Used on auth screens; text label included for screen readers.
 */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div
        aria-hidden="true"
        className="flex size-[5.25rem] items-center justify-center rounded-full bg-primary-50 shadow-xs"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-500"
        >
          <circle
            cx="16"
            cy="16"
            r="11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.35"
          />
          <path
            d="M8 20C11.5 13 20.5 13 24 20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="16" cy="14" r="2" fill="currentColor" fillOpacity="0.6" />
        </svg>
      </div>
      <p className="text-overline font-semibold tracking-[0.12em] text-primary-600">
        Liminal
      </p>
    </div>
  );
}
