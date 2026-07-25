"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AsciiField } from "@/components/AsciiField";

const appLinks = [
  ["Dashboard", "/dashboard", "Command center"],
  ["Tasks", "/tasks", "Local leads"],
  ["Check-in", "/check-in", "Daily gate"],
  ["Mind", "/mental-health", "Load plan"],
  ["Ask AI", "/assistant", "Agent"],
  ["Rewards", "/rewards", "Progress"],
];

export function AppChrome({
  children,
  app = false,
}: {
  children: React.ReactNode;
  app?: boolean;
}) {
  const pathname = usePathname();

  return (
    <main className="app">
      <AsciiField />
      <div className="corner tl">L</div>
      <div className="corner tr">I</div>
      <div className="corner bl">L</div>
      <div className="corner br">Y</div>
      <header className={app ? "topbar app-nav" : "topbar home-nav"}>
        <Link className="brand" href="/">
          <span className="brand-mark"><img src="/liminal-logo.png" alt="" /></span>
          <span>
            <strong>LIIMINAL</strong>
            <small>Traveller OS</small>
          </span>
        </Link>
        <nav className="menu navlinks" aria-label="Primary navigation">
          {app ? (
            appLinks.map(([label, href, helper]) => (
              <Link
                className={pathname === href ? "active" : ""}
                key={`${label}-${href}`}
                href={href}
              >
                <span>{label}</span>
                <small>{helper}</small>
              </Link>
            ))
          ) : null}
        </nav>
        {app ? (
          <div className="nav-actions">
            <Link className="profile-chip" href="/dashboard" aria-label="Open profile dashboard">
              <span>Profile</span>
              <strong>Dashboard</strong>
            </Link>
          </div>
        ) : (
          <div className="navdots" aria-hidden="true"><span /><span /><span /><span /><span /></div>
        )}
      </header>
      {children}
    </main>
  );
}
