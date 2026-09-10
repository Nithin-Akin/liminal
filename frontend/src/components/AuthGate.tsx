"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserId } from "@/lib/api";

const openRoutes = new Set(["/", "/login"]);

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState(openRoutes.has(pathname));
  const [checking, setChecking] = useState(!openRoutes.has(pathname));

  useEffect(() => {
    let live = true;
    if (openRoutes.has(pathname)) {
      setAllowed(true);
      setChecking(false);
      return;
    }

    const authenticated = Boolean(window.localStorage.getItem("liiminal.access_token") && getUserId());
    if (!live) return;
    setAllowed(authenticated);
    setChecking(false);
    if (!authenticated) router.replace("/login");

    return () => {
      live = false;
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="gate-screen">
        <div className="template-card">
          <div className="kicker">Daily check-in required</div>
          <h1>Loading access state...</h1>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="gate-screen">
        <div className="template-card">
          <div className="kicker">Daily check-in required</div>
          <h1>Check in before using Liiminal.</h1>
          <p>Traveller mode needs today&apos;s mood, blockers, and context before tasks, dashboard, rewards, or AI answers unlock.</p>
          <Link className="btn primary" href="/check-in">Start check-in</Link>
        </div>
      </div>
    );
  }

  return children;
}
