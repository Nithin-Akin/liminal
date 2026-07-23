/**
 * Section divider for auth screens — separates sign-in from sign-up paths.
 */
export function AuthDivider() {
  return (
    <div
      className="flex flex-col items-center gap-2"
      role="separator"
      aria-label="New here?"
    >
      <span className="h-px w-full bg-border-default" aria-hidden="true" />
      <span className="text-body-sm text-text-muted">New here?</span>
      <span className="h-px w-full bg-border-default" aria-hidden="true" />
    </div>
  );
}
