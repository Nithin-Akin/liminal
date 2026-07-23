"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Button,
  FadeIn,
  PageHeader,
  ScreenContainer,
  SlideUp,
} from "@/components";
import { STAGGER } from "@/constants/animation";
import { ROUTES } from "@/constants/routes";
import { MotionButtonWrapper } from "@/features/auth/components/MotionButtonWrapper";
import { OnboardingStepper } from "@/features/onboarding/components/OnboardingStepper";
import { TransitionTypeCard } from "@/features/onboarding/components/TransitionTypeCard";
import { TRANSITION_TYPES } from "@/features/onboarding/constants/transition-types";
import type { TransitionType } from "@/features/onboarding/constants/transition-types";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { saveTransitionType } from "@/services/onboarding.service";

const TOTAL_ONBOARDING_STEPS = 5;
const CURRENT_STEP = 0;

const GRID_BASE_DELAY = 0.12;

function cardDelay(index: number) {
  return GRID_BASE_DELAY + STAGGER.default * index;
}

/**
 * Transition Selection screen — first step of onboarding.
 * User picks exactly one transition type before continuing to Day One.
 */
export function TransitionSelectionScreen() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [selectedType, setSelectedType] = useState<TransitionType | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const canContinue = selectedType !== null && !isLoading;

  async function handleContinue() {
    if (!selectedType) return;

    setIsLoading(true);

    try {
      const response = await saveTransitionType({
        transitionType: selectedType,
      });
      console.log("[Liminal Onboarding] Transition type saved:", response);
      router.push(ROUTES.dayOne);
    } catch (error) {
      console.error("[Liminal Onboarding] Failed to save transition type:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScreenContainer className="relative min-h-dvh justify-between pb-8 pt-6">
      <FadeIn className="flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex size-11 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <ArrowLeft aria-hidden="true" size={20} strokeWidth={1.75} />
          </button>

          <OnboardingStepper
            totalSteps={TOTAL_ONBOARDING_STEPS}
            currentStep={CURRENT_STEP}
          />

          <div className="size-11" aria-hidden="true" />
        </div>

        <PageHeader
          title="What are you going through?"
          className="mt-8 items-start py-0 text-left [&_h1]:text-display-md [&_h1]:font-semibold"
        />

        <p className="mt-2 text-body-md leading-relaxed text-text-secondary">
          Select what feels most relevant right now.
        </p>

        <div
          role="radiogroup"
          aria-label="Transition type"
          className="mt-8 grid grid-cols-2 gap-4"
        >
          {TRANSITION_TYPES.map((option, index) => (
            <SlideUp key={option.id} delay={cardDelay(index)}>
              <TransitionTypeCard
                icon={option.icon}
                label={option.label}
                selected={selectedType === option.id}
                onSelect={() => setSelectedType(option.id)}
                disabled={isLoading}
              />
            </SlideUp>
          ))}
        </div>
      </FadeIn>

      <SlideUp delay={cardDelay(TRANSITION_TYPES.length)} className="mt-8">
        <MotionButtonWrapper disabled={prefersReducedMotion || !canContinue}>
          <Button
            type="button"
            fullWidth
            size="lg"
            isLoading={isLoading}
            disabled={!canContinue}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </MotionButtonWrapper>
      </SlideUp>
    </ScreenContainer>
  );
}
