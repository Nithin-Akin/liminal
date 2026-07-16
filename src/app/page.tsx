"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { BarChart } from "@/components/ui/BarChart";
import { Chip } from "@/components/ui/Chip";
import { MovingIllustration } from "@/components/ui/Illustrations";
import {
  MOCK_USER,
  HOME_INSIGHTS,
  getPhaseLabel,
} from "@/lib/mock-data";
import { getGreeting } from "@/lib/utils";

const QUICK_LINKS = [
  { href: "/check-in", label: "Check in", color: "card-orange" },
  { href: "/chat", label: "AI Chat", color: "card-purple" },
  { href: "/scout", label: "Scout", color: "card-blue" },
  { href: "/community", label: "Circles", color: "card-yellow" },
];

export default function HomePage() {
  const { name, city, dayNumber, totalDays, phase } = MOCK_USER;
  const progress = Math.round((dayNumber / totalDays) * 100);

  return (
    <div className="min-h-full bg-bg">
      <PageHeader
        showSearch
        showNotifications
        showProfile
        transparent
      />

      <div className="px-5 pb-6">
        {/* Greeting row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 flex items-start justify-between"
        >
          <div>
            <p className="text-sm text-text-muted">{getGreeting()},</p>
            <h2 className="text-2xl font-extrabold text-text">Hi, {name}!</h2>
            <button
              type="button"
              className="mt-1 flex items-center gap-1 text-xs font-semibold text-text-muted"
            >
              {city}, India
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <MovingIllustration className="h-20 w-24 shrink-0" />
        </motion.div>

        {/* Alert card — orange like reference */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Link
            href="/check-in"
            className="bento-card card-orange flex items-start gap-3 p-5 transition active:scale-[0.99]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-text-dark/10">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-70">
                Day {dayNumber} · High priority
              </p>
              <p className="mt-1 text-base font-extrabold leading-snug">
                THE DIP IS HERE
              </p>
              <p className="mt-1 text-xs font-medium opacity-80">
                Loneliness peaks Day 18–22. This is normal — not a wrong choice.
              </p>
            </div>
            <ArrowUpRight className="h-5 w-5 shrink-0 opacity-60" />
          </Link>
        </motion.div>

        {/* Progress + phase — purple card with chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bento-card card-purple mt-4 p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-60">
                Transition progress
              </p>
              <p className="mt-1 text-3xl font-extrabold">{progress}%</p>
              <p className="mt-0.5 text-xs font-semibold opacity-70">
                {getPhaseLabel(phase)} · Day {dayNumber}/{totalDays}
              </p>
            </div>
            <Link
              href="/arc"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-text-dark/10"
            >
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          <BarChart
            className="mt-5"
            data={[
              { label: "W1", value: 40 },
              { label: "W2", value: 65 },
              { label: "W3", value: 100, highlight: true },
              { label: "W4", value: 70 },
              { label: "W5", value: 45 },
            ]}
          />

          <div className="mt-4 flex gap-2">
            <Chip variant="dark" className="!bg-text-dark/10 !border-text-dark/20 !text-text-dark">
              +{totalDays - dayNumber} days left
            </Chip>
            <Chip variant="dark" className="!bg-text-dark/10 !border-text-dark/20 !text-text-dark">
              Phase 3 of 5
            </Chip>
          </div>
        </motion.div>

        {/* Quick links grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-4 grid grid-cols-2 gap-3"
        >
          {QUICK_LINKS.map(({ href, label, color }) => (
            <Link
              key={href}
              href={href}
              className={`bento-card ${color} flex items-center justify-between p-4 font-extrabold transition active:scale-[0.98]`}
            >
              <span className="text-sm uppercase tracking-wide">{label}</span>
              <ChevronRight className="h-4 w-4 opacity-60" />
            </Link>
          ))}
        </motion.div>

        {/* Insights — dark cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5 space-y-3"
        >
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-text-faint">
            Today&apos;s insights
          </p>
          {HOME_INSIGHTS.map((insight) => (
            <div
              key={insight.id}
              className={`bento-card p-4 ${
                insight.type === "warning"
                  ? "border border-orange/30 bg-orange/10"
                  : "card-dark"
              }`}
            >
              <p className="text-sm font-extrabold text-text">{insight.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">
                {insight.body}
              </p>
            </div>
          ))}
        </motion.div>

        {/* AI chat preview */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Link
            href="/chat"
            className="bento-card card-mint mt-4 flex items-center gap-3 p-4 transition active:scale-[0.99]"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-60">
                AI Companion
              </p>
              <p className="mt-1 truncate text-sm font-bold">
                &ldquo;Day 18–22 is when loneliness peaks...&rdquo;
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-text-dark px-2.5 py-1 text-[10px] font-extrabold text-mint">
              NEW
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
