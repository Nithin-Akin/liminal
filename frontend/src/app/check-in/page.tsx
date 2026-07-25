"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppChrome } from "@/components/AppChrome";
import { AuthGate } from "@/components/AuthGate";
import { dayNumber, defaultProfile, readProfile } from "@/lib/profile";
import { submitCheckin } from "@/lib/api";
import type { UserProfile } from "@/types/app";

const moods = [
  { value: 1, label: "Rough" },
  { value: 2, label: "Off" },
  { value: 3, label: "Steady" },
  { value: 4, label: "Good" },
  { value: 5, label: "Strong" },
];

export default function CheckInPage() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [response, setResponse] = useState("");
  const [note, setNote] = useState("");
  const [mood, setMood] = useState(3);
  const [status, setStatus] = useState("");
  const router = useRouter();

  useEffect(() => setProfile(readProfile()), []);

  const day = dayNumber(profile.dayOne);

  async function submit() {
    setResponse("");
    setStatus("Sending check-in to agent...");
    try {
      const data = await submitCheckin({
        day_number: day,
        transition_type: profile.transitionType,
        mood,
        note,
        profile,
      });
      setResponse(data.response);
      setStatus(`Phase: ${data.phase_name} · Day ${data.day_number}`);
      window.localStorage.setItem("liiminal.lastCheckin", data.created_at ?? new Date().toISOString().slice(0, 10));
    } catch (error) {
      setResponse("");
      setStatus(error instanceof Error ? error.message : "Check-in failed. Backend agent did not respond.");
    }
  }

  return (
    <AuthGate>
    <AppChrome app>
      <section className="section checkin-shell">
        <div className="checkin-head">
          <div>
            <div className="kicker">Check-in · Day {day}</div>
            <h1 className="serif dashboard-title">Signal in. Action out.</h1>
            <p className="compact-copy">Tell Liiminal what changed today. The agent uses this to unlock dashboard, tasks, recommendations, and mental-load plans.</p>
          </div>
          <div className="checkin-metrics">
            <article><strong>{profile.city || "City"}</strong><span>Base</span></article>
            <article><strong>{profile.locality || "Locality"}</strong><span>Area</span></article>
            <article><strong>₹{profile.monthlyBudget ? profile.monthlyBudget.toLocaleString() : "Budget"}</strong><span>Monthly</span></article>
          </div>
        </div>

        <div className="checkin-board">
          <form className="panel panel-pad checkin-card" onSubmit={(event) => { event.preventDefault(); submit(); }}>
            <label className="field full">
              <span className="label">Mood</span>
              <div className="mood-grid">
                {moods.map((m) => (
                  <button
                    type="button"
                    key={m.value}
                    className={mood === m.value ? "btn primary" : "btn"}
                    onClick={() => setMood(m.value)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </label>
            <label className="field full"><span className="label">Traveller note</span><textarea className="input" placeholder="Food, sleep, commute, PG leads, money friction, safety, loneliness, or anything blocking today." value={note} onChange={(e) => setNote(e.target.value)} /></label>
            <div className="actions"><button className="btn primary">Check in</button><button className="btn" type="button" onClick={() => router.push("/dashboard")}>Continue</button><Link className="btn" href="/tasks">Tasks</Link></div>
            <p className="source">{status}</p>
          </form>

          <aside className="dark-panel checkin-visual">
            <div className="kicker">Traveller scan</div>
            <div className="wing-meter" aria-hidden="true"><span style={{ width: `${mood * 20}%` }} /></div>
            <div className="cards">
              <div className="mini-task"><span>1</span><div><strong>Housing</strong><small>{profile.housingStatus || "Not captured"}</small></div></div>
              <div className="mini-task"><span>2</span><div><strong>Commute</strong><small>{profile.commuteMode || "Not captured"}</small></div></div>
              <div className="mini-task"><span>3</span><div><strong>Support</strong><small>{profile.supportLevel || "Not captured"}</small></div></div>
            </div>
          </aside>

          {response ? <div className="agent-output checkin-output">{response.split("\n").filter(Boolean).map((line) => <p key={line}>{line}</p>)}</div> : null}
        </div>
      </section>
    </AppChrome>
    </AuthGate>
  );
}
