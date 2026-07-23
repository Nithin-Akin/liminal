"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import {
  Button,
  FadeIn,
  PageHeader,
  ScreenContainer,
  SlideUp,
} from "@/components";
import { STAGGER } from "@/constants/animation";
import { ROUTES } from "@/constants/routes";
import { AuthDivider } from "@/features/auth/components/AuthDivider";
import { BrandMark } from "@/features/auth/components/BrandMark";
import { EmailInput } from "@/features/auth/components/EmailInput";
import { LoginBackground } from "@/features/auth/components/LoginBackground";
import { LoginFooter } from "@/features/auth/components/LoginFooter";
import { MotionButtonWrapper } from "@/features/auth/components/MotionButtonWrapper";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { SecondaryAuthLink } from "@/features/auth/components/SecondaryAuthLink";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { login } from "@/services/auth.service";
import { cn } from "@/lib/utils";

interface FormErrors {
  email?: string;
  password?: string;
}

const FORM_BASE_DELAY = 0.12;

function fieldDelay(index: number) {
  return FORM_BASE_DELAY + STAGGER.default * index;
}

/**
 * Login screen — calm, welcoming entry point for returning users.
 * Submits to auth.service (mock) and logs the response.
 */
export function LoginScreen() {
  const prefersReducedMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Please enter your password.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({ email: email.trim(), password });
      console.log("[Liminal Auth] Login response:", response);
    } catch (error) {
      console.error("[Liminal Auth] Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScreenContainer className="relative min-h-dvh justify-between overflow-hidden pb-8 pt-16">
      <LoginBackground />

      <FadeIn className="relative z-10 flex flex-1 flex-col">
        <div className="flex flex-col items-center text-center">
          <BrandMark className="mb-10" />

          <PageHeader
            title="Welcome back"
            display
            className="w-full items-center py-0 text-center [&_h1]:text-display-lg [&_h1]:font-semibold"
          />

          <p className="mt-4 max-w-[20rem] text-body-md leading-relaxed text-text-secondary">
            Continue your journey,
            <br />
            one step at a time.
          </p>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-4"
          aria-label="Login form"
        >
          <SlideUp delay={fieldDelay(0)}>
            <EmailInput
              label="Email address"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={errors.email}
              disabled={isLoading}
            />
          </SlideUp>

          <SlideUp delay={fieldDelay(1)}>
            <div className="flex flex-col gap-1">
              <PasswordInput
                label="Password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={errors.password}
                disabled={isLoading}
              />

              <div className="flex justify-end">
                <Link
                  href={ROUTES.forgotPassword}
                  className={cn(
                    "inline-flex min-h-11 items-center text-label-md font-medium text-primary-600",
                    "rounded-md px-1 transition-colors hover:text-primary-700",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
                  )}
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </SlideUp>

          <SlideUp delay={fieldDelay(2)}>
            <MotionButtonWrapper disabled={prefersReducedMotion}>
              <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                Continue
              </Button>
            </MotionButtonWrapper>
          </SlideUp>

          <SlideUp delay={fieldDelay(3)}>
            <div className="flex flex-col gap-3">
              <AuthDivider />

              <MotionButtonWrapper disabled={prefersReducedMotion}>
                <SecondaryAuthLink
                  href={ROUTES.register}
                  aria-disabled={isLoading || undefined}
                  tabIndex={isLoading ? -1 : undefined}
                  className={
                    isLoading ? "pointer-events-none opacity-50" : undefined
                  }
                >
                  Create account
                </SecondaryAuthLink>
              </MotionButtonWrapper>
            </div>
          </SlideUp>
        </form>
      </FadeIn>

      <LoginFooter />
    </ScreenContainer>
  );
}
