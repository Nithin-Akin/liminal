"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppChrome } from "@/components/AppChrome";
import { AuthGate } from "@/components/AuthGate";
import { getCheckinHistory, getDashboard, getRelocationPlan, type DashboardState, type RelocationPlan } from "@/lib/api";
import { phases } from "@/lib/profile";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardState | null>(null);
  const [status, setStatus] = useState("Loading agent dashboard...");
  const [moods, setMoods] = useState<Array<{ mood?: number; created_at?: string }>>([]);
  const [plan, setPlan] = useState<RelocationPlan | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const payload = await getDashboard();
        setDashboard(payload);
        setStatus("Fetched from agent state");
        getCheckinHistory().then((history) => setMoods(history.entries.slice(-7))).catch(() => undefined);
        getRelocationPlan().then(setPlan).catch(() => undefined);
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
          {plan ? <section className="attention-section"><div className="kicker">Needs high attention</div><div className="attention-grid">{[...plan.blockers, ...plan.risks].filter((item) => item.impact === "high").slice(0, 3).map((item, index) => <article className="template-card attention-card" key={`${item.title}-${index}`}><div className="attention-mark">!</div><div><h3>{item.title}</h3><p className="source">{item.evidence}</p><Link className="text-link" href={item.title.toLowerCase().includes("housing") ? "/research/housing" : item.title.toLowerCase().includes("bank") ? "/banking" : "/tasks"}>Open next step →</Link></div></article>)}{![...plan.blockers, ...plan.risks].some((item) => item.impact === "high") ? <article className="template-card attention-card"><div className="attention-mark">✓</div><div><h3>No urgent blockers</h3><p className="source">Your saved relocation state is currently within plan.</p></div></article> : null}</div></section> : null}
          {profile.monthlyBudget < 15000 ? <div className="budget-alert"><strong>Budget check:</strong> Your monthly budget is ₹{profile.monthlyBudget.toLocaleString()}. Avoid using credit to cover recurring housing costs unless repayment is already certain; first compare lower-cost options and total move-in costs.</div> : null}
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
            <article className="template-card wide-card mood-trend"><div className="kicker">Mood signal · last 7 check-ins</div>{moods.length ? <div className="mood-bars">{moods.map((entry, index) => <div className="mood-bar" key={`${entry.created_at}-${index}`}><span style={{ height: `${Math.max(12, (entry.mood ?? 0) * 20)}%` }} /><small>{entry.mood ?? "-"}</small></div>)}</div> : <p className="source">Complete check-ins to establish a trend. This is a signal, not a diagnosis.</p>}</article>
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
