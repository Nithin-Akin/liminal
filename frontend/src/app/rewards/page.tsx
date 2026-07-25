"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppChrome } from "@/components/AppChrome";
import { AuthGate } from "@/components/AuthGate";
import { getRewards, type RewardsState } from "@/lib/api";

export default function RewardsPage() {
  const [rewards, setRewards] = useState<RewardsState | null>(null);
  const [status, setStatus] = useState("Loading rewards from agent state...");

  useEffect(() => {
    async function load() {
      try {
        const data = await getRewards();
        setRewards(data);
        setStatus("Fetched from agent state");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Could not load rewards.");
      }
    }
    load();
  }, []);

  return (
    <AuthGate>
      <AppChrome app>
        <section className="section grid-two">
          <div>
            <div className="kicker">Rewards</div>
            <h1 className="serif section-title">{rewards?.level ?? "No rewards yet"}</h1>
            <p className="hero-copy">Rewards measure operational progress: check-ins, completed setup actions, and streaks. No vanity badges for doing nothing.</p>
            <div className="actions"><Link className="btn primary" href="/tasks">Complete actions</Link></div>
          </div>
          {rewards ? (
            <div className="panel panel-pad cards">
              {[["Points", rewards.points], ["Streak", `${rewards.streak} days`], ["Completed tasks", rewards.completed_tasks]].map(([label, value]) => (
                <div className="phase-card" key={label}><div className="kicker">{label}</div><h3>{value}</h3></div>
              ))}
            </div>
          ) : (
            <div className="template-card empty-state">
              <p>{status}</p>
            </div>
          )}
        </section>
      </AppChrome>
    </AuthGate>
  );
}
