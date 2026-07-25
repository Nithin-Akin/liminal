"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppChrome } from "@/components/AppChrome";

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("liiminal.session")) {
      router.replace(localStorage.getItem("liiminal.profile") ? "/dashboard" : "/onboarding");
    }
  }, [router]);
  return (
    <AppChrome>
      <section className="section grid-two">
        <div>
          <div className="kicker">Access</div>
          <h1 className="serif section-title">Start with identity.</h1>
          <p className="hero-copy">For the demo, this creates a local session and moves to onboarding. Supabase auth can replace this form without changing the flow.</p>
        </div>
        <form className="panel panel-pad" onSubmit={(event) => { event.preventDefault(); localStorage.setItem("liiminal.session", "demo"); router.push("/onboarding"); }}>
          <label className="field"><span className="label">Email</span><input className="input" type="email" defaultValue="nithin@example.com" /></label>
          <label className="field"><span className="label">Password</span><input className="input" type="password" defaultValue="password123" /></label>
          <div className="actions"><button className="btn primary">Continue</button></div>
        </form>
      </section>
    </AppChrome>
  );
}
