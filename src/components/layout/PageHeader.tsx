import Link from "next/link";
import { ChevronLeft, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownPill } from "@/components/ui/DropdownPill";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  dropdown?: string;
  transparent?: boolean;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  backHref,
  showSearch = false,
  showNotifications = false,
  showProfile = false,
  dropdown,
  transparent = false,
  children,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3",
        transparent ? "bg-transparent" : "bg-bg/90 backdrop-blur-md"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {backHref && (
            <Link
              href={backHref}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-bg-card text-text-muted transition hover:text-text"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          )}
          <div className="min-w-0">
            {title && (
              <h1 className="screen-title truncate text-text">{title}</h1>
            )}
            {subtitle && (
              <p className="truncate text-xs text-text-muted">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {dropdown && <DropdownPill label={dropdown} />}
          {showSearch && (
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-card text-text-muted"
            >
              <Search className="h-4 w-4" />
            </button>
          )}
          {showNotifications && (
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-card text-text-muted"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange" />
            </button>
          )}
          {showProfile && (
            <Link
              href="/profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow text-sm font-bold text-text-dark"
            >
              N
            </Link>
          )}
          {children}
        </div>
      </div>
    </header>
  );
}
