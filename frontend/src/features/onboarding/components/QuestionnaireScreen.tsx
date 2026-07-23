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
import { QuestionOptionRow } from "@/features/onboarding/components/QuestionOptionRow";
import { QUESTIONNAIRE } from "@/features/onboarding/constants/questionnaire";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { saveQuestionnaire } from "@/services/onboarding.service";

const TOTAL_ONBOARDING_STEPS = 5;
const CURRENT_STEP = 2;

const OPTION_BASE_DELAY = 0.12;

function optionDelay(index: number) {
  return OPTION_BASE_DELAY + STAGGER.default * index;
}

/**
 * Questionnaire screen — third step of onboarding.
 * Shows one question at a time; answers are collected and submitted together
 * once all five are complete.
 */
export function QuestionnaireScreen() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const totalQuestions = QUESTIONNAIRE.length;
  const currentQuestion = QUESTIONNAIRE[questionIndex];
  const isLastQuestion = questionIndex === totalQuestions - 1;
  const selectedOptionId = answers[currentQuestion.id];
  const canContinue = Boolean(selectedOptionId) && !isLoading;

  function handleBack() {
    if (questionIndex === 0) {
      router.back();
      return;
    }

    setQuestionIndex((current) => current - 1);
  }

  async function handleContinue() {
    if (!selectedOptionId) return;

    if (!isLastQuestion) {
      setQuestionIndex((current) => current + 1);
      return;
    }

    setIsLoading(true);

    try {
      const response = await saveQuestionnaire({ answers });
      console.log("[Liminal Onboarding] Questionnaire saved:", response);
      router.push(ROUTES.arcReveal);
    } catch (error) {
      console.error("[Liminal Onboarding] Failed to save questionnaire:", error);
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
            onClick={handleBack}
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

        {/* Sub-progress within the questionnaire itself */}
        <div
          className="mt-6 flex items-center gap-2"
          aria-hidden="true"
        >
          {QUESTIONNAIRE.map((question, index) => (
            <div
              key={question.id}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
                index <= questionIndex ? "bg-primary-500" : "bg-bg-subtle",
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-body-sm text-text-muted">
          Question {questionIndex + 1} of {totalQuestions}
        </p>

        <PageHeader
          key={currentQuestion.id}
          title={currentQuestion.question}
          className="mt-6 items-start py-0 text-left [&_h1]:text-display-md [&_h1]:font-semibold"
        />

        <div
          role="radiogroup"
          aria-label={currentQuestion.question}
          className="mt-8 flex flex-col gap-3"
        >
          {currentQuestion.options.map((option, index) => (
            <SlideUp key={option.id} delay={optionDelay(index)}>
              <QuestionOptionRow
                icon={option.icon}
                label={option.label}
                selected={selectedOptionId === option.id}
                onSelect={() =>
                  setAnswers((current) => ({
                    ...current,
                    [currentQuestion.id]: option.id,
                  }))
                }
                disabled={isLoading}
              />
            </SlideUp>
          ))}
        </div>
      </FadeIn>

      <SlideUp
        delay={optionDelay(currentQuestion.options.length)}
        className="mt-8"
      >
        <MotionButtonWrapper disabled={prefersReducedMotion || !canContinue}>
          <Button
            type="button"
            fullWidth
            size="lg"
            isLoading={isLoading}
            disabled={!canContinue}
            onClick={handleContinue}
          >
            {isLastQuestion ? "Complete" : "Continue"}
          </Button>
        </MotionButtonWrapper>
      </SlideUp>
    </ScreenContainer>
  );
}
