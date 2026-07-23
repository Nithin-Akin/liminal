"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";

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
import { FullNameInput } from "@/features/auth/components/FullNameInput";
import { LoginBackground } from "@/features/auth/components/LoginBackground";
import { LoginFooter } from "@/features/auth/components/LoginFooter";
import { MotionButtonWrapper } from "@/features/auth/components/MotionButtonWrapper";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { SecondaryAuthLink } from "@/features/auth/components/SecondaryAuthLink";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { register } from "@/services/auth.service";
import { cn } from "@/lib/utils";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const FORM_BASE_DELAY = 0.12;

function fieldDelay(index: number) {
  return FORM_BASE_DELAY + STAGGER.default * index;
}

type PasswordStrength = "weak" | "fair" | "strong";

function getPasswordStrength(password: string): PasswordStrength | null {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return "weak";
  if (score <= 3) return "fair";
  return "strong";
}

const strengthStyles: Record<
  PasswordStrength,
  { label: string; bar: string; text: string }
> = {
  weak: {
    label: "Weak password",
    bar: "w-1/3 bg-error",
    text: "text-error",
  },
  fair: {
    label: "Fair password",
    bar: "w-2/3 bg-warning",
    text: "text-warning",
  },
  strong: {
    label: "Strong password",
    bar: "w-full bg-success",
    text: "text-success",
  },
};

/**
 * Register screen — mirrors LoginScreen's layout, motion, and validation
 * conventions so the auth flow feels like one continuous experience.
 */
export function RegisterScreen() {
  const prefersReducedMotion = useReducedMotion();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password],
  );

  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Please create a password.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (password && confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords don't match.";
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
      const response = await register({
        name: fullName.trim(),
        email: email.trim(),
        password,
      });
      console.log("[Liminal Auth] Register response:", response);
    } catch (error) {
      console.error("[Liminal Auth] Registration failed:", error);
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
            title="Create your account"
            display
            className="w-full items-center py-0 text-center [&_h1]:text-display-lg [&_h1]:font-semibold"
          />

          <p className="mt-4 max-w-[20rem] text-body-md leading-relaxed text-text-secondary">
            You&apos;re one step closer,
            <br />
            let&apos;s walk it together.
          </p>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-4"
          aria-label="Registration form"
        >
          <SlideUp delay={fieldDelay(0)}>
            <FullNameInput
              label="Full name"
              name="fullName"
              placeholder="Your name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              error={errors.fullName}
              disabled={isLoading}
            />
          </SlideUp>

          <SlideUp delay={fieldDelay(1)}>
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

          <SlideUp delay={fieldDelay(2)}>
            <div className="flex flex-col gap-2">
              <PasswordInput
                label="Password"
                name="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={errors.password}
                disabled={isLoading}
              />

              {passwordStrength && !errors.password ? (
                <div
                  className="flex items-center gap-2"
                  aria-live="polite"
                >
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-bg-subtle">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
                        strengthStyles[passwordStrength].bar,
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-body-sm",
                      strengthStyles[passwordStrength].text,
                    )}
                  >
                    {strengthStyles[passwordStrength].label}
                  </span>
                </div>
              ) : null}
            </div>
          </SlideUp>

          <SlideUp delay={fieldDelay(3)}>
            <PasswordInput
              label="Confirm password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              error={errors.confirmPassword}
              disabled={isLoading}
            />
          </SlideUp>

          <SlideUp delay={fieldDelay(4)}>
            <MotionButtonWrapper disabled={prefersReducedMotion}>
              <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                Create account
              </Button>
            </MotionButtonWrapper>
          </SlideUp>

          <SlideUp delay={fieldDelay(5)}>
            <div className="flex flex-col gap-3">
              <AuthDivider />

              <MotionButtonWrapper disabled={prefersReducedMotion}>
                <SecondaryAuthLink
                  href={ROUTES.login}
                  aria-disabled={isLoading || undefined}
                  tabIndex={isLoading ? -1 : undefined}
                  className={
                    isLoading ? "pointer-events-none opacity-50" : undefined
                  }
                >
                  Already have an account? Log in
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
