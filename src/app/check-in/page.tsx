"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Chip } from "@/components/ui/Chip";
import { LonelyIllustration } from "@/components/ui/Illustrations";
import { MOOD_OPTIONS, MOCK_USER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function CheckInPage() {
  const [step, setStep] = useState(0);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-bg px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-mint">
            <Check className="h-10 w-10 text-text-dark" />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-text">Checked in</h2>
          <p className="mt-2 max-w-xs text-sm text-text-muted">
            Day {MOCK_USER.dayNumber} recorded. The dip is temporary — you
            showed up for yourself.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-[20px] bg-orange px-8 py-3.5 text-sm font-extrabold uppercase tracking-wider text-text-dark"
          >
            Back home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-bg">
      <PageHeader
        title="Check In"
        subtitle={`Day ${MOCK_USER.dayNumber} · ${MOCK_USER.city}`}
        backHref="/"
      />

      <div className="flex justify-center gap-2 px-5 pb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === step ? "w-8 bg-orange" : i < step ? "w-4 bg-orange/40" : "w-4 bg-border"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="mood"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-5"
          >
            <LonelyIllustration className="mx-auto mb-4 h-28 w-36" />
            <h2 className="text-xl font-extrabold text-text">How are you feeling?</h2>
            <p className="mt-1 text-sm text-text-muted">No wrong answers.</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setSelectedMood(mood.id)}
                  className={cn(
                    "bento-card flex flex-col items-center gap-2 p-5 transition active:scale-[0.98]",
                    selectedMood === mood.id
                      ? "border-2 border-orange bg-orange/10"
                      : "card-dark"
                  )}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-sm font-bold text-text">{mood.label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={!selectedMood}
              onClick={() => setStep(1)}
              className="mt-8 w-full rounded-[20px] bg-orange py-4 text-sm font-extrabold uppercase tracking-wider text-text-dark disabled:opacity-30"
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="energy"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-5"
          >
            <h2 className="text-xl font-extrabold text-text">Energy level</h2>
            <p className="mt-1 text-sm text-text-muted">How much capacity today?</p>

            <div className="bento-card card-purple mt-10 flex flex-col items-center p-8">
              <span className="text-6xl font-extrabold">{energy}</span>
              <span className="mt-1 text-xs font-bold uppercase tracking-wider opacity-60">
                out of 10
              </span>
              <input
                type="range"
                min={1}
                max={10}
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="mt-8 w-full"
              />
              <div className="mt-2 flex w-full justify-between text-[10px] font-bold uppercase tracking-wider opacity-50">
                <span>Depleted</span>
                <span>Full</span>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="flex-1 rounded-[20px] border border-border py-4 text-sm font-bold text-text-muted"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 rounded-[20px] bg-orange py-4 text-sm font-extrabold uppercase tracking-wider text-text-dark"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="reflect"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-5"
          >
            <h2 className="text-xl font-extrabold text-text">Anything on your mind?</h2>
            <p className="mt-1 text-sm text-text-muted">
              What&apos;s taking up most of your mental space?
            </p>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              placeholder="Optional — share as much or as little..."
              className="input-dark mt-5 w-full resize-none rounded-[20px] p-4 text-sm"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {["Work stress", "Homesick", "Overwhelmed", "Okay actually"].map(
                (tag) => (
                  <Chip key={tag} onClick={() => setNote(tag)}>
                    {tag}
                  </Chip>
                )
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-[20px] border border-border py-4 text-sm font-bold text-text-muted"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setDone(true)}
                className="flex-1 rounded-[20px] bg-orange py-4 text-sm font-extrabold uppercase tracking-wider text-text-dark"
              >
                Complete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
