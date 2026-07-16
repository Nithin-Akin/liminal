"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, MessageCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/arc", label: "Arc", icon: BarChart3 },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/profile", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/onboarding")) return null;

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[398px] -translate-x-1/2">
      <div className="flex items-center justify-around rounded-[28px] border border-border bg-bg-elevated/95 px-2 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl px-4 py-1 transition",
                active ? "text-orange" : "text-text-faint hover:text-text-muted"
              )}
            >
              <Icon
                className="h-5 w-5"
                strokeWidth={active ? 2.5 : 1.8}
                fill={active ? "currentColor" : "none"}
              />
              <span className="text-[9px] font-bold uppercase tracking-wider">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
