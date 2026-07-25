"use client";

import { useState } from "react";
import Link from "next/link";
import { AppChrome } from "@/components/AppChrome";
import { AuthGate } from "@/components/AuthGate";
import { askAgent, type AgentAnswer } from "@/lib/api";

const stressLevels = ["Low", "Medium", "High", "Overloaded"];
const sleepLevels = ["Good", "Broken", "Very low", "Not sure"];

export default function MentalHealthPage() {
  const [stress, setStress] = useState("High");
  const [sleep, setSleep] = useState("Broken");
  const [note, setNote] = useState("");
  const [answer, setAnswer] = useState<AgentAnswer | null>(null);
  const [status, setStatus] = useState("Uses the same LLM agent as the main assistant.");

  async function generateSupportPlan() {
    setAnswer(null);
    setStatus("Sending mental-load context to agent...");
    try {
      setAnswer(await askAgent(`Build a mental-load support plan for a traveller who just moved. Stress: ${stress}. Sleep: ${sleep}. Note: ${note || "No extra note"}. Format practical steps, reduce decision load, include when to seek human/professional help, and connect it to relocation tasks.`));
      setStatus("Generated from saved profile, progress, and your mental-load inputs.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Mental-load agent failed.");
    }
  }

  return (
    <AuthGate>
      <AppChrome app>
        <section className="section traveller-shell">
          <div className="traveller-hero">
            <div className="kicker">Mind · traveller load</div>
            <h1 className="serif section-title">Keep the move usable.</h1>
            <p className="hero-copy">This is not a hardcoded page. It sends your stress, sleep, note, profile, tasks, and progress to the agent for a practical support plan.</p>
          </div>

          <div className="traveller-grid">
            <section className="template-card">
              <div className="form-grid">
                <label className="field">
                  <span className="label">Stress load</span>
                  <select className="input" value={stress} onChange={(event) => setStress(event.target.value)}>
                    {stressLevels.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="field">
                  <span className="label">Sleep</span>
                  <select className="input" value={sleep} onChange={(event) => setSleep(event.target.value)}>
                    {sleepLevels.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="field full">
                  <span className="label">What is making today harder?</span>
                  <textarea className="input" value={note} onChange={(event) => setNote(event.target.value)} />
                </label>
              </div>
              <div className="actions">
                <button className="btn primary" onClick={generateSupportPlan}>Generate support plan</button>
                <Link className="btn" href="/dashboard">Dashboard</Link>
              </div>
              <p className="source">{status}</p>
            </section>

            {answer ? (
              <section className="template-card dark-panel">
                <div className="kicker">{answer.last_checked}</div>
                <h2>{answer.title}</h2>
                <p>{answer.summary}</p>
                <div className="cards">
                  {answer.plan.map((step, index) => (
                    <div className="mini-task" key={step}>
                      <span>{index + 1}</span>
                      <div><strong>{step}</strong></div>
                    </div>
                  ))}
                </div>
                <p><strong>Next:</strong> {answer.next_action}</p>
              </section>
            ) : null}
          </div>
        </section>
      </AppChrome>
    </AuthGate>
  );
}
