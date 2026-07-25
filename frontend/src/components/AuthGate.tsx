"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCheckinStatus } from "@/lib/api";

const openRoutes = new Set(["/", "/onboarding", "/check-in"]);

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

    setChecking(true);
    getCheckinStatus()
      .then((status) => {
        if (!live) return;
        setAllowed(status.checked_in);
        setChecking(false);
        if (!status.checked_in) router.replace("/check-in");
      })
      .catch(() => {
        if (!live) return;
        setAllowed(false);
        setChecking(false);
        router.replace("/check-in");
      });

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
