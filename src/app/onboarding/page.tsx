"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BarChart } from "@/components/ui/BarChart";
import { MovingIllustration } from "@/components/ui/Illustrations";

const CITIES = ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai"];

export default function OnboardingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <div className="flex flex-1 flex-col px-6 pt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MovingIllustration className="mx-auto h-36 w-48" />

          <div className="mt-6 inline-flex items-center rounded-full bg-yellow/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yellow">
            First 90 days, supported
          </div>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-text">
            Welcome to
            <br />
            <span className="text-orange">Liminal</span>
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            The in-between is hard. What you feel follows a pattern millions
            have walked — and we know what comes next.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bento-card card-purple mt-8 p-5"
        >
          <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-60">
            The 90-day arc
          </p>
          <BarChart
            className="mt-4"
            data={[
              { label: "Honeymoon", value: 40 },
              { label: "Reality", value: 65 },
              { label: "Dip", value: 100, highlight: true },
              { label: "Adjust", value: 70 },
              { label: "Home", value: 45 },
            ]}
          />
          <p className="mt-4 text-xs font-medium opacity-70">
            We&apos;ll be here before you need to ask.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bento-card rounded-b-none border-t border-border bg-bg-elevated px-6 pb-10 pt-8"
        style={{ borderRadius: "28px 28px 0 0" }}
      >
        <h2 className="text-lg font-extrabold text-text">
          Set up your journey
        </h2>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-faint">
              Your name
            </label>
            <input
              type="text"
              defaultValue="Nithin"
              className="input-dark w-full px-4 py-3.5 text-sm"
              placeholder="What should we call you?"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-faint">
              New city
            </label>
            <div className="flex flex-wrap gap-2">
              {CITIES.map((city) => (
                <button
                  key={city}
                  type="button"
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                    city === "Bengaluru"
                      ? "bg-orange text-text-dark"
                      : "border border-border bg-bg-card text-text-muted"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-faint">
              Move date
            </label>
            <input
              type="date"
              defaultValue="2026-03-08"
              className="input-dark w-full px-4 py-3.5 text-sm [color-scheme:dark]"
            />
          </div>
        </div>

        <Link
          href="/"
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-[20px] bg-orange py-4 text-sm font-extrabold uppercase tracking-wider text-text-dark transition active:scale-[0.98]"
        >
          Begin Day 1
          <ArrowRight className="h-5 w-5" />
        </Link>

        <p className="mt-4 text-center text-[10px] text-text-faint">
          UI prototype · No data stored
        </p>
      </motion.div>
    </div>
  );
}
