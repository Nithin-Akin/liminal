"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppChrome } from "@/components/AppChrome";
import { AuthGate } from "@/components/AuthGate";
import { defaultProfile, writeProfile } from "@/lib/profile";
import { saveProfile } from "@/lib/api";
import type { UserProfile } from "@/types/app";

const options = {
  ageRange: ["18-24", "25-34", "35-44", "45+"],
  housingStatus: ["Need PG/coliving", "Shortlisted PGs", "Have temporary stay", "Have permanent housing"],
  bankStatus: ["Need local account", "Have account, need branch support", "Need UPI/KYC help", "Banking sorted"],
  simStatus: ["Need new SIM", "Need better data plan", "Have SIM, weak coverage", "SIM sorted"],
  commuteMode: ["Walk", "Metro + walk", "Metro + auto", "Bike", "Auto/cab", "Bus", "Not decided"],
  safetyPriority: ["Very high", "High", "Medium", "Low"],
  foodPreference: ["Vegetarian", "Non vegetarian", "Vegan", "Jain", "No restriction", "Need budget meals"],
  supportLevel: ["No local network", "Low local network", "Some friends nearby", "Family/friends nearby"],
};

function SelectField<K extends keyof UserProfile>({
  label,
  value,
  field,
  values,
  onChange,
}: {
  label: string;
  value: string;
  field: K;
  values: string[];
  onChange: (field: K, value: UserProfile[K]) => void;
}) {
  return (
    <label className="field">
      <span className="label">{label}</span>
      <select className="input" value={value} onChange={(event) => onChange(field, event.target.value as UserProfile[K])} required>
        <option value="">Select</option>
        {values.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
  );
}

export default function OnboardingPage() {
  const [profile, setProfile] = useState(defaultProfile);
  const [locationStatus, setLocationStatus] = useState("Not requested");
  const [submitStatus, setSubmitStatus] = useState("Your profile is saved to the agent before the dashboard opens.");
  const router = useRouter();

  function update<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Location unavailable in this browser");
      return;
    }
    setLocationStatus("Requesting...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setProfile((current) => ({
          ...current,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }));
        setLocationStatus("Location captured");
      },
      () => setLocationStatus("Location denied; locality will be used"),
    );
  }

  async function submitProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitStatus("Saving profile to agent...");
    writeProfile(profile);
    try {
      await saveProfile(profile);
      setSubmitStatus("Profile saved. Building dashboard...");
      router.push("/dashboard");
    } catch (error) {
      setSubmitStatus(error instanceof Error ? error.message : "Could not save profile to agent.");
    }
  }

  return (
    <AuthGate>
    <AppChrome app>
      <section className="section">
        <div className="grid-two">
          <div>
            <div className="kicker">01 · intake</div>
            <h1 className="serif section-title">Tell Liiminal what has to work.</h1>
            <p className="hero-copy">Recommendations unlock only after these constraints exist. This is the difference between a chatbot and a city operating system.</p>
          </div>
          <form className="panel panel-pad template-card" onSubmit={submitProfile}>
            <div className="form-grid">
              <label className="field"><span className="label">Name</span><input className="input" required value={profile.name} onChange={(e) => update("name", e.target.value)} /></label>
              <SelectField label="Age range" field="ageRange" value={profile.ageRange} values={options.ageRange} onChange={update} />
              <label className="field"><span className="label">City</span><input className="input" required value={profile.city} onChange={(e) => update("city", e.target.value)} /></label>
              <label className="field"><span className="label">Locality</span><input className="input" required value={profile.locality} onChange={(e) => update("locality", e.target.value)} /></label>
              <label className="field"><span className="label">Work / college target</span><input className="input" required value={profile.destination} onChange={(e) => update("destination", e.target.value)} /></label>
              <label className="field full"><span className="label">Destination address (optional but recommended)</span><input className="input" value={profile.destinationAddress} placeholder="Paste the full university/work address" onChange={(e) => update("destinationAddress", e.target.value)} /></label>
              <label className="field"><span className="label">Monthly budget</span><input className="input" required min={1} type="number" value={profile.monthlyBudget || ""} onChange={(e) => update("monthlyBudget", Number(e.target.value))} /></label>
              <SelectField label="Housing status" field="housingStatus" value={profile.housingStatus} values={options.housingStatus} onChange={update} />
              <SelectField label="Banking status" field="bankStatus" value={profile.bankStatus} values={options.bankStatus} onChange={update} />
              <SelectField label="SIM status" field="simStatus" value={profile.simStatus} values={options.simStatus} onChange={update} />
              <SelectField label="Commute mode" field="commuteMode" value={profile.commuteMode} values={options.commuteMode} onChange={update} />
              <SelectField label="Safety priority" field="safetyPriority" value={profile.safetyPriority} values={options.safetyPriority} onChange={update} />
              <SelectField label="Food preference" field="foodPreference" value={profile.foodPreference} values={options.foodPreference} onChange={update} />
              <SelectField label="Support level" field="supportLevel" value={profile.supportLevel} values={options.supportLevel} onChange={update} />
              <label className="field"><span className="label">Day 1</span><input className="input" required type="date" value={profile.dayOne} onChange={(e) => update("dayOne", e.target.value)} /></label>
              <label className="field full"><span className="label">Context</span><textarea className="input" value={profile.intakeNote} onChange={(e) => update("intakeNote", e.target.value)} /></label>
            </div>
            <div className="actions">
              <button className="btn" type="button" onClick={requestLocation}>{locationStatus}</button>
              <button className="btn primary">Save profile + build dashboard</button>
            </div>
            <p className="source">{submitStatus}</p>
          </form>
        </div>
      </section>
    </AppChrome>
    </AuthGate>
  );
}
