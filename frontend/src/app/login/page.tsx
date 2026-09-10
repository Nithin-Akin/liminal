"use client";

import { useRouter } from "next/navigation";
import { AppChrome } from "@/components/AppChrome";
import { login } from "@/lib/api";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await login(String(form.get("email")), String(form.get("password")));
      localStorage.setItem("liiminal.access_token", result.session.access_token);
      localStorage.setItem("liiminal.user_id", result.user.id);
      localStorage.setItem("liiminal.session", "supabase");
      router.push(localStorage.getItem("liiminal.profile") ? "/dashboard" : "/onboarding");
    } catch (e) { setError(e instanceof Error ? e.message : "Login failed"); }
  }
  return (
    <AppChrome hideNav>
      <section className="section login-shell">
        <div className="login-intro">
          <div className="kicker">Liminal traveller OS · 01</div>
          <h1 className="serif section-title">Make the next city feel like yours.</h1>
          <p className="hero-copy">Your place, your pace, your plan. Pick up exactly where the move needs you.</p>
          <div className="login-signal-field" aria-hidden="true">
            <span className="signal-orbit orbit-one" /><span className="signal-orbit orbit-two" /><span className="signal-node node-home">HOME</span><span className="signal-node node-next">NEXT CITY</span><span className="signal-route" />
          </div>
          <div className="login-signals"><div><strong>01</strong><span>your profile</span></div><div><strong>02</strong><span>your essentials</span></div><div><strong>03</strong><span>your first week</span></div></div>
        </div>
        <form className="panel panel-pad login-form" onSubmit={submit}>
          <label className="field"><span className="label">Email</span><input name="email" className="input" type="email" required /></label>
          <label className="field"><span className="label">Password</span><input name="password" className="input" type="password" required /></label>
          <div className="actions"><button className="btn primary login-submit">Continue</button></div>
          {error ? <p className="source">{error}</p> : null}
        </form>
      </section>
    </AppChrome>
  );
}
