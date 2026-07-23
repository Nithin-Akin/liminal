import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ArcRevealIllustrationProps {
  className?: string;
}

/**
 * Layered radial-glow illustration used on the Arc Reveal screen.
 * Pure CSS gradients + one lucide icon — no image asset, scales crisply
 * at any viewport size.
 */
export function ArcRevealIllustration({
  className,
}: ArcRevealIllustrationProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex items-center justify-center",
        "size-56 sm:size-64 md:size-72",
        className,
      )}
    >
      {/* Outer soft glow */}
      <div
        className="absolute inset-0 rounded-full opacity-70 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent-200) 0%, transparent 70%)",
        }}
      />

      {/* Mid ring */}
      <div className="absolute inset-6 rounded-full border border-primary-200/60" />
      <div className="absolute inset-12 rounded-full border border-primary-200/40" />

      {/* Core */}
      <div
        className="relative flex size-24 items-center justify-center rounded-full shadow-md sm:size-28"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, var(--color-primary-300) 0%, var(--color-primary-500) 70%)",
        }}
      >
        <Sparkles
          className="size-9 text-text-inverse sm:size-10"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}