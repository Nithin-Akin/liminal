import { cn } from "@/lib/utils";


export interface OnboardingStepperProps {
  /** Total number of steps in the onboarding flow. */
  totalSteps: number;
  /** Zero-indexed current step. */
  currentStep: number;
  className?: string;
}

/**
 * Dot-based progress indicator for the onboarding flow.
 * The active step renders wider and filled; others are quiet and small.
 */
export function OnboardingStepper({
  totalSteps,
  currentStep,
  className,
}: OnboardingStepperProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
      className={cn("flex items-center justify-center gap-1.5", className)}
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const isActive = index === currentStep;

        return (
          <span
            key={index}
            aria-hidden="true"
            className={cn(
              "h-1.5 rounded-full transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
              isActive ? "w-6 bg-primary-500" : "w-1.5 bg-border-default",
            )}
          />
        );
      })}
    </div>
  );
}
