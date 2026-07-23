/**
 * Subtle sage-to-cream gradient anchored to the bottom of auth screens.
 */
export function LoginBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(180deg,transparent_0%,var(--color-primary-50)_40%,var(--color-accent-50)_100%)] opacity-[0.88]"
    />
  );
}
