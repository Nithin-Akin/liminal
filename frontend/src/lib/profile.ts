import type { UserProfile } from "@/types/app";

export const defaultProfile: UserProfile = {
  name: "",
  ageRange: "",
  genderContext: "",
  transitionType: "moving_city",
  city: "",
  locality: "",
  destination: "",
  destinationAddress: "",
  monthlyBudget: 0,
  housingStatus: "",
  bankStatus: "",
  simStatus: "",
  commuteMode: "",
  foodPreference: "",
  safetyPriority: "",
  supportLevel: "",
  dayOne: new Date().toISOString().slice(0, 10),
  intakeNote: ""
};

export function dayNumber(dayOne: string) {
  const start = new Date(`${dayOne}T00:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = today.getTime() - start.getTime();
  return Math.min(90, Math.max(1, Math.floor(diff / 86400000) + 1));
}

export const phases = [
  { label: "Landing", range: "Days 1-14", color: "#7b7d78", note: "identity docs, SIM, housing checks" },
  { label: "Reality", range: "Days 15-35", color: "#ff4d16", note: "banking, commute, daily systems" },
  { label: "Adjustment", range: "Days 36-65", color: "#c49b5a", note: "habits, support, local services" },
  { label: "Emerging", range: "Days 66-90", color: "#88a98e", note: "optimization, confidence, autonomy" }
];

export function phaseForDay(day: number) {
  if (day <= 14) return phases[0];
  if (day <= 35) return phases[1];
  if (day <= 65) return phases[2];
  return phases[3];
}

export function readProfile() {
  if (typeof window === "undefined") return defaultProfile;
  const saved = window.localStorage.getItem("liiminal.profile");
  if (!saved) return defaultProfile;
  try {
    return { ...defaultProfile, ...JSON.parse(saved) } as UserProfile;
  } catch {
    return defaultProfile;
  }
}

export function writeProfile(profile: UserProfile) {
  window.localStorage.setItem("liiminal.profile", JSON.stringify(profile));
}
