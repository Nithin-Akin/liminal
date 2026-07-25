"use client";

import { useState } from "react";
import Link from "next/link";
import { AppChrome } from "@/components/AppChrome";
import { AuthGate } from "@/components/AuthGate";
import { askAgent, type AgentAnswer } from "@/lib/api";

export default function AssistantPage() {
  const [question, setQuestion] = useState("Find me a practical plan for housing and banking this week.");
  const [answer, setAnswer] = useState<AgentAnswer | null>(null);
  const [status, setStatus] = useState("Ask anything about your move.");

  async function ask() {
    setAnswer(null);
    setStatus("Agent is reading your saved profile, tasks, rewards and context...");
    try {
      setAnswer(await askAgent(question));
      setStatus("Answered from saved context");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Agent failed");
    }
  }

  return (
    <AuthGate>
      <AppChrome app>
        <section className="section">
          <div className="kicker">AI interaction</div>
          <h1 className="serif section-title">Ask the operating system.</h1>
          <p className="hero-copy">The agent uses your saved profile, generated tasks and reward/progress state. It should return plans, comparisons, links, and next actions.</p>
          <div className="template-card assistant-composer">
            <label className="field full">
              <span className="label">Question</span>
              <textarea className="input" value={question} onChange={(event) => setQuestion(event.target.value)} />
            </label>
            <div className="actions"><button className="btn primary" onClick={ask}>Ask agent</button><Link className="btn" href="/dashboard">Dashboard</Link></div>
            <p className="source">{status}</p>
          </div>
          {answer ? (
            <div className="cards assistant-answer">
              <section className="template-card wide-card">
                <div className="kicker">{answer.last_checked}</div>
                <h2 className="serif response">{answer.title}</h2>
                <p>{answer.summary}</p>
                <p><strong>Next action:</strong> {answer.next_action}</p>
              </section>
              <section className="template-card">
                <div className="kicker">Plan</div>
                <div className="cards three">
                  {answer.plan.map((step, index) => <div className="phase-card" key={step}><div className="kicker">0{index + 1}</div><p>{step}</p></div>)}
                </div>
              </section>
              <section className="template-card wide-card" style={{ overflowX: "auto" }}>
                <div className="kicker">Recommendations</div>
                <table className="comparison">
                  <thead><tr><th>Name</th><th>Comparison</th><th>Fit</th><th>Source</th></tr></thead>
                  <tbody>
                    {answer.recommendations.map((item) => (
                      <tr key={item.name}>
                        <td>{item.name}</td>
                        <td>{Object.entries(item.comparison).map(([k, v]) => <div key={k}><strong>{k}:</strong> {v}</div>)}</td>
                        <td>{item.fit_reason}</td>
                        <td><a href={item.source_url} target="_blank" rel="noreferrer">{item.source_type}</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </div>
          ) : null}
        </section>
      </AppChrome>
    </AuthGate>
  );
}
