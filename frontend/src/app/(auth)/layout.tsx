import type { ReactNode } from "react";

/**
 * Minimal layout for auth screens — no bottom nav, full-height calm background.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-bg-base">{children}</div>
  );
}
