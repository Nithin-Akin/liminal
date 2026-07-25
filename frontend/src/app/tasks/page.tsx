"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppChrome } from "@/components/AppChrome";
import { AuthGate } from "@/components/AuthGate";
import { defaultProfile, readProfile } from "@/lib/profile";
import { completeAgentTask, generateTasks, type AgentTaskResponse } from "@/lib/api";

export default function TasksPage() {
  const [profile, setProfile] = useState(defaultProfile);
  const [data, setData] = useState<AgentTaskResponse | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [status, setStatus] = useState("Waiting for task agent");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => setProfile(readProfile()), []);

  async function generate(force = false) {
    setStatus("Agent is reading profile and generating tasks...");
    setData(null);
    try {
      setData(await generateTasks(force, profile.location));
      setStatus("Generated from saved profile");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Task generation failed");
    }
  }

  async function completeTask(taskId: string) {
    await completeAgentTask(taskId).catch(() => undefined);
    setCompleted((current) => ({ ...current, [taskId]: true }));
  }

  useEffect(() => {
    generate(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthGate>
      <AppChrome app>
        <section className="section">
          <div className="kicker">Agentic action board</div>
          <h1 className="serif section-title">Generated from your saved profile.</h1>
          <p className="hero-copy">Profile: {profile.city}, {profile.locality}, budget ₹{profile.monthlyBudget}, destination {profile.destination}, safety {profile.safetyPriority}. No fallback task list is rendered if the agent fails.</p>
          <div className="actions">
            <button className="btn primary" onClick={() => generate(true)}>Regenerate with agent</button>
            <Link className="btn" href="/dashboard">Back to dashboard</Link>
          </div>
          <p className="source">{status}</p>

          {data ? (
            <div className="cards task-stack" style={{ marginTop: 36 }}>
              <div className="panel panel-pad">
                <div className="kicker">Source policy</div>
                <p>{data.source_policy}</p>
                <p className="source">{data.summary}</p>
              </div>
              {data.tasks.sort((a, b) => a.priority - b.priority).map((task) => (
                <article className="panel panel-pad task-card" key={task.id}>
                  <button className="task-head" onClick={() => setOpen(open === task.id ? null : task.id)}>
                    <span className="task-icon">{task.icon}</span>
                    <span><span className="kicker">{task.category} · priority {task.priority}</span><strong>{task.title}</strong></span>
                    <span>{open === task.id ? "CLOSE" : "DETAILS"}</span>
                  </button>
                  <p>{task.why_now}</p>
                  {open === task.id ? (
                    <div className="task-detail">
                      <div className="lead-visual-row">
                        {task.image_url ? <img src={task.image_url} alt="" className="task-image" /> : null}
                        <div>
                          <div className="kicker">LLM extracted leads</div>
                          <p className="source">Use these as candidate names, then verify current reviews, rent, deposit, and distance before visiting.</p>
                        </div>
                      </div>
                      <div className="lead-grid">
                        {task.options.map((option) => (
                          <a className="lead-card" href={task.search_url} target="_blank" rel="noreferrer" key={option.name}>
                            <strong>{option.name}</strong>
                            <span>{option.fit_reason}</span>
                          </a>
                        ))}
                      </div>
                      <div style={{ overflowX: "auto" }}>
                        <table className="comparison">
                          <thead><tr><th>Option</th>{task.comparison_fields.map((field) => <th key={field}>{field}</th>)}<th>Fit</th></tr></thead>
                          <tbody>
                            {task.options.map((option) => (
                              <tr key={option.name}>
                                <td>{option.name}</td>
                                {task.comparison_fields.map((field) => <td key={field}>{option.values[field] ?? "Needs live verification"}</td>)}
                                <td>{option.fit_reason}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p><strong>Next action:</strong> {task.next_action}</p>
                      <div className="actions">
                        <a className="btn" href={task.search_url} target="_blank" rel="noreferrer">Open source/search</a>
                        <button className="btn primary" onClick={() => completeTask(task.id)}>
                          {completed[task.id] ? "Completed +40 pts" : "Mark complete"}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </AppChrome>
    </AuthGate>
  );
}
