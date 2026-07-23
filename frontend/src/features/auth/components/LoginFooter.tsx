import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

/**
 * Trust and support links anchored to the bottom of auth screens.
 */
export function LoginFooter() {
  return (
    <footer className="relative z-10 mt-auto pt-6 text-center">
      <p className="text-body-sm text-text-muted">
        Protected by modern encryption
      </p>
      <p className="mt-3 text-body-sm text-text-muted">
        <FooterLink href={ROUTES.privacy}>Privacy</FooterLink>
        <span aria-hidden="true" className="mx-2 text-border-default">
          •
        </span>
        <FooterLink href={ROUTES.support}>Support</FooterLink>
      </p>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center font-medium text-primary-600 underline-offset-2",
        "hover:text-primary-700 hover:underline",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
      )}
    >
      {children}
    </Link>
  );
}
