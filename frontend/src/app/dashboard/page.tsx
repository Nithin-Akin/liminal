"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppChrome } from "@/components/AppChrome";
import { AuthGate } from "@/components/AuthGate";
import { getDashboard, type DashboardState } from "@/lib/api";
import { phases } from "@/lib/profile";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardState | null>(null);
  const [status, setStatus] = useState("Loading agent dashboard...");

  useEffect(() => {
    async function load() {
      try {
        const payload = await getDashboard();
        setDashboard(payload);
        setStatus("Fetched from agent state");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Could not load dashboard.");
      }
    }
    load();
  }, []);
  const profile = dashboard?.profile;
  const progress = dashboard?.setup_progress.percent ?? 0;

  return (
    <AuthGate>
    <AppChrome app>
      <section className="section template-shell">
        <div className="template-top">
          <div>
            <div className="kicker">Dashboard · {profile?.city ?? "profile required"}</div>
            <h1 className="dashboard-title">Welcome in, {profile?.name ?? "complete onboarding"}</h1>
          </div>
          <div className="metric-row">
            <div><strong>{dashboard?.day_number ?? 0}</strong><span>Day</span></div>
            <div><strong>{dashboard?.pending_priority_areas.length ?? 0}</strong><span>Priorities</span></div>
            <div><strong>{dashboard?.rewards.points ?? 0}</strong><span>Points</span></div>
          </div>
        </div>

        {dashboard && profile?.name ? (
          <>
          <p className="hero-copy compact-copy">Current blockers: {dashboard.pending_priority_areas.join(", ") || "none logged yet"}. Setup is {progress}% complete from saved task and reward state.</p>
          <div className="progress-strip">
            <span>Profile</span><b style={{ width: "100%" }} />
            <span>Tasks</span><b style={{ width: `${progress}%` }} />
            <span>Output</span>
          </div>
          <div className="dashboard-board">
            <article className="template-card profile-card">
              <div>
                <div className="avatar-initial">{profile.name.slice(0, 1).toUpperCase()}</div>
                <h2>{profile.name}</h2>
                <p>{profile.locality} · {profile.destination}</p>
              </div>
              <span>₹{profile.monthlyBudget.toLocaleString()}</span>
            </article>
            <article className="template-card stat-card"><h3>Progress</h3><strong>{progress}%</strong><span>{dashboard.setup_progress.completed}/{dashboard.setup_progress.total} complete</span></article>
            <article className="template-card stat-card"><h3>Phase</h3><strong>{dashboard.phase}</strong><span>Day {dashboard.day_number}</span></article>
            <article className="template-card stat-card"><h3>Rewards</h3><strong>{dashboard.rewards.points}</strong><span>{dashboard.rewards.level}</span></article>
            <article className="template-card wide-card">
              <div className="kicker">Saved profile context</div>
              <p>Housing: {profile.housingStatus}</p>
              <p>Banking: {profile.bankStatus}</p>
              <p>SIM: {profile.simStatus}</p>
              <p>Commute: {profile.commuteMode}</p>
            </article>
            <aside className="dark-task-panel">
              <div className="task-panel-head">
                <span>Priority plan</span>
                <strong>{dashboard.setup_progress.completed}/{dashboard.setup_progress.total}</strong>
              </div>
              {dashboard.pending_priority_areas.map((area, index) => (
                <div className="mini-task" key={area}>
                  <span>{index + 1}</span>
                  <div><strong>{area}</strong><small>Ask AI or generate tasks for next action</small></div>
                </div>
              ))}
            </aside>
          </div>
          <div className="actions">
            <Link className="btn primary" href="/tasks">Open action board</Link>
            <Link className="btn" href="/check-in">Check in</Link>
            <Link className="btn" href="/assistant">Ask AI</Link>
          </div>
          <div className="cards three template-phases">
            {phases.map((item) => <div className="phase-card" key={item.label}><div className="kicker" style={{ color: item.color }}>{item.range}</div><h3>{item.label}</h3><p className="source">{item.note}</p></div>)}
          </div>
          </>
        ) : (
          <div className="template-card empty-state">
            <h2>{status}</h2>
            <p>No hardcoded dashboard data is being shown. Complete onboarding so the backend agent can build your profile state.</p>
            <Link className="btn primary" href="/onboarding">Get started</Link>
          </div>
        )}
      </section>
    </AppChrome>
    </AuthGate>
  );
}
