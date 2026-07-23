"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Button,
  FadeIn,
  PageHeader,
  ScreenContainer,
  SlideUp,
} from "@/components";
import { ROUTES } from "@/constants/routes";
import { MotionButtonWrapper } from "@/features/auth/components/MotionButtonWrapper";
import { ArcRevealIllustration } from "@/features/onboarding/components/ArcRevealIllustration";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Arc Reveal — the closing moment of onboarding.
 * Deliberately has no back arrow or step indicator: this is an arrival,
 * not another step in a checklist.
 */
export function ArcRevealScreen() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [isEntering, setIsEntering] = useState(false);

  function handleContinue() {
    setIsEntering(true);
    router.push(ROUTES.arcMap);
  }

  return (
    <ScreenContainer className="relative min-h-dvh items-center justify-between overflow-hidden pb-8 pt-16">
      {/* Ambient glow bleeds to the edges on larger viewports; on mobile it stays contained behind the content. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, var(--color-accent-100) 0%, transparent 55%)",
        }}
      />

      <FadeIn className="flex flex-1 flex-col items-center justify-center text-center">
        <SlideUp delay={0.05}>
          <ArcRevealIllustration className="mb-10" />
        </SlideUp>

        <SlideUp delay={0.15}>
          <PageHeader
            title="Your journey has begun"
            display
            className="w-full items-center py-0 text-center [&_h1]:text-display-lg [&_h1]:font-semibold"
          />
        </SlideUp>

        <SlideUp delay={0.22}>
          <p className="mt-4 max-w-[22rem] text-body-md leading-relaxed text-text-secondary">
            Here is your personalized transition arc — we&apos;ll walk it
            with you, one day at a time.
          </p>
        </SlideUp>
      </FadeIn>

      <SlideUp delay={0.3} className="w-full">
        <MotionButtonWrapper disabled={prefersReducedMotion}>
          <Button
            type="button"
            fullWidth
            size="lg"
            isLoading={isEntering}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </MotionButtonWrapper>
      </SlideUp>
    </ScreenContainer>
  );
}