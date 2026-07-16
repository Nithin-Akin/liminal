import { BottomNav } from "./BottomNav";

export function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-start justify-center bg-[#0a0a0a]">
      <div className="relative flex min-h-dvh w-full max-w-[430px] flex-col bg-bg">
        <main className="flex-1 pb-28">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
