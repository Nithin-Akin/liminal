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
import { DateCalendar } from "@/features/onboarding/components/DateCalendar";
import { OnboardingStepper } from "@/features/onboarding/components/OnboardingStepper";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { saveDayOne } from "@/services/onboarding.service";

const TOTAL_ONBOARDING_STEPS = 5;
const CURRENT_STEP = 1;

const CONTENT_BASE_DELAY = 0.12;

function contentDelay(index: number) {
  return CONTENT_BASE_DELAY + STAGGER.default * index;
}

/**
 * Day One screen — second step of onboarding.
 * User marks when their transition began; this date anchors the Arc Map.
 */
export function DayOneScreen() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canContinue = selectedDate !== null && !isLoading;

  async function handleContinue() {
    if (!selectedDate) return;

    setIsLoading(true);

    try {
      const response = await saveDayOne({ startDate: selectedDate });
      console.log("[Liminal Onboarding] Day One saved:", response);
      router.push(ROUTES.questionnaire);
    } catch (error) {
      console.error("[Liminal Onboarding] Failed to save Day One:", error);
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
          title="When did your transition begin?"
          className="mt-8 items-start py-0 text-left [&_h1]:text-display-md [&_h1]:font-semibold"
        />

        <p className="mt-2 text-body-md leading-relaxed text-text-secondary">
          This helps us build your journey.
        </p>

        <SlideUp delay={contentDelay(0)} className="mt-8">
          <DateCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            disabled={isLoading}
          />
        </SlideUp>
      </FadeIn>

      <SlideUp delay={contentDelay(1)} className="mt-8">
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
