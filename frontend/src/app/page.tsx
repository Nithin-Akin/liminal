import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="landing-kicker">AI relocation intelligence</p>
          <h1>
            Land in a city
            <span>with a system.</span>
          </h1>
          <p className="landing-summary">
            Liiminal starts by collecting your real details, stores them with the
            agent, then builds a dashboard, plans, recommendations, and progress
            from that saved profile.
          </p>
          <Link className="landing-cta" href="/login">
            Get started
          </Link>
        </div>

        <div className="landing-spiral" aria-hidden="true">
          <div className="spiral-disc" />
          <div className="spiral-disc spiral-disc-secondary" />
        </div>
      </section>
    </main>
  );
}
