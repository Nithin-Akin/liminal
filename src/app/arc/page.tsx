"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { Chip } from "@/components/ui/Chip";
import { BarChart } from "@/components/ui/BarChart";
import { ARC_PHASES, MOCK_USER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PHASE_COLORS: Record<string, string> = {
  honeymoon: "card-yellow",
  reality: "card-purple",
  loneliness: "card-orange",
  adjustment: "card-mint",
  integration: "card-blue",
};

export default function ArcMapPage() {
  const { dayNumber, phase } = MOCK_USER;
  const activeIndex = ARC_PHASES.findIndex((p) => p.id === phase);

  return (
    <div className="min-h-full bg-bg">
      <PageHeader
        title="Arc Map"
        subtitle="90-day transition journey"
        backHref="/"
        dropdown="all phases"
      />

      <div className="px-5 pb-8">
        {/* Summary stat card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bento-card card-orange p-5"
        >
          <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-60">
            Current position
          </p>
          <p className="mt-1 text-4xl font-extrabold">Day {dayNumber}</p>
          <p className="mt-1 text-sm font-bold opacity-80">
            {ARC_PHASES[activeIndex]?.label} phase
          </p>
          <div className="mt-4 flex gap-2">
            <Chip className="!bg-text-dark/10 !border-text-dark/20 !text-text-dark">
              71 days left
            </Chip>
            <Chip className="!bg-text-dark/10 !border-text-dark/20 !text-text-dark">
              Phase {activeIndex + 1}/5
            </Chip>
          </div>
        </motion.div>

        {/* Chart overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bento-card card-purple mt-4 p-5"
        >
          <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-60">
            Emotional intensity
          </p>
          <BarChart
            className="mt-4"
            data={ARC_PHASES.map((p, i) => ({
              label: p.label.split(" ")[0].slice(0, 4),
              value: [40, 65, 100, 70, 45][i],
              highlight: p.id === phase,
            }))}
          />
        </motion.div>

        {/* Phase cards */}
        <div className="mt-4 space-y-3">
          {ARC_PHASES.map((arcPhase, index) => {
            const isActive = arcPhase.id === phase;
            const isPast = activeIndex > index;

            return (
              <motion.div
                key={arcPhase.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07 }}
                className={cn(
                  "bento-card p-4 transition",
                  isActive
                    ? PHASE_COLORS[arcPhase.id]
                    : isPast
                      ? "card-dark opacity-70"
                      : "card-dark opacity-40"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold">
                        {arcPhase.label}
                      </span>
                      {isActive && (
                        <span className="rounded-full bg-text-dark/20 px-2 py-0.5 text-[9px] font-extrabold uppercase">
                          You
                        </span>
                      )}
                    </div>
                    <Chip
                      className={cn(
                        "mt-2",
                        isActive
                          ? "!bg-text-dark/10 !border-text-dark/20 !text-text-dark"
                          : ""
                      )}
                    >
                      {arcPhase.days}
                    </Chip>
                    <p
                      className={cn(
                        "mt-2 text-xs leading-relaxed",
                        isActive ? "opacity-80" : "text-text-muted"
                      )}
                    >
                      {arcPhase.description}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-text-dark/10 text-sm font-extrabold">
                    {index + 1}
                  </span>
                </div>

                {isActive && (
                  <div className="mt-3 rounded-2xl bg-text-dark/10 p-3">
                    <p className="text-[9px] font-extrabold uppercase tracking-widest opacity-60">
                      What to know
                    </p>
                    <p className="mt-1 text-xs font-medium opacity-90">
                      {arcPhase.insight}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="bento-card card-dark mt-5 p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-text-faint">
            Grounded in research
          </p>
          <p className="mt-2 text-xs leading-relaxed text-text-muted">
            Based on William Bridges&apos; transition model, immigration
            adjustment studies, and cognitive load research.
          </p>
        </div>
      </div>
    </div>
  );
}
