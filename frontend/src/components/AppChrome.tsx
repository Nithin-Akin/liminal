"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AsciiField } from "@/components/AsciiField";

const groups: Array<[string, Array<[string, string]>]> = [["Workspace", [["Dashboard", "/dashboard"], ["Daily", "/daily"], ["Tasks", "/tasks"]]], ["Research", [["Housing", "/research/housing"], ["Banking", "/banking"], ["Connectivity", "/research/connectivity"], ["Healthcare", "/research/healthcare"], ["Food", "/research/food"]]], ["Assistant", [["Ask AI", "/assistant"], ["Rewards", "/rewards"]]]];

export function AppChrome({
  children,
  app = false,
  hideNav = false,
}: {
  children: React.ReactNode;
  app?: boolean;
  hideNav?: boolean;
}) {
  const pathname = usePathname();

  return (
    <main className="app">
      <AsciiField />
      <div className="corner tl">L</div>
      <div className="corner tr">I</div>
      <div className="corner bl">L</div>
      <div className="corner br">Y</div>
      {!hideNav ? <header className={app ? "topbar app-nav" : "topbar home-nav"}>
        <Link className="brand" href="/">
          <span className="brand-mark"><img src="/liminal-logo.png" alt="" /></span>
          <span>
            <strong>LIIMINAL</strong>
            <small>Traveller OS</small>
          </span>
        </Link>
        <nav className="menu navlinks" aria-label="Primary navigation">
          {app ? (
            <><Link className={pathname === "/dashboard" ? "active nav-primary" : "nav-primary"} href="/dashboard"><span>Dashboard</span><small>Current state</small></Link>{groups.slice(1).map(([label, items]) => <details className="nav-group" key={label}><summary>{label}</summary><div className="nav-menu">{items.map(([item, href]) => <Link className={pathname === href ? "active" : ""} key={href} href={href}>{item}</Link>)}</div></details>)}</>
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
      </header> : null}
      {children}
    </main>
  );
}
