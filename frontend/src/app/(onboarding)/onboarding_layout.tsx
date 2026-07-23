import type { ReactNode } from "react";

/**
 * Minimal layout for onboarding screens — no bottom nav, matches (auth)'s
 * full-height calm background. Bottom nav starts once onboarding completes.
 */
export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-bg-base">{children}</div>
  );
}
