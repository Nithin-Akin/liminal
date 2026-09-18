import type { UserProfile } from "@/types/app";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export function getUserId() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("liiminal.user_id") ?? "";
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(typeof window !== "undefined" && window.localStorage.getItem("liiminal.access_token")
        ? { Authorization: `Bearer ${window.localStorage.getItem("liiminal.access_token")}` }
        : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export interface DashboardState {
  user_id: string;
  profile?: UserProfile;
  day_number: number;
  phase: string;
  setup_progress: { completed: number; total: number; percent: number };
  pending_priority_areas: string[];
  rewards: { points: number; streak: number; level: string; completed_tasks?: number };
}

export interface AgentAnswer {
  title: string;
  summary: string;
  plan: string[];
  recommendations: Array<{
    name: string;
    comparison: Record<string, string>;
    source_url: string;
    source_type: string;
    fit_reason: string;
  }>;
  next_action: string;
  last_checked: string;
}

export interface AgentTask {
  id: string;
  category: string;
  title: string;
  priority: number;
  icon: string;
  image_url: string | null;
  why_now: string;
  search_url: string;
  source_type: string;
  last_checked: string;
  comparison_fields: string[];
  options: Array<{ name: string; values: Record<string, string>; fit_reason: string }>;
  next_action: string;
}

export interface AgentTaskResponse {
  summary: string;
  source_policy: string;
  tasks: AgentTask[];
}

export async function saveProfile(profile: UserProfile) {
  return apiFetch<{ saved: boolean; profile: UserProfile }>("/profiles", {
    method: "POST",
    body: JSON.stringify({ profile }),
  });
}

export async function getDashboard() {
  return apiFetch<DashboardState>(`/dashboard/${getUserId()}`);
}

export interface RelocationPlan {
  generated_at: string;
  summary: string;
  state: { budget: number | null; completed_tasks: number; total_tasks: number; verified_sources: number; recent_mood: number | null };
  blockers: Array<{ title: string; impact: string; evidence: string }>;
  risks: Array<{ title: string; impact: string; evidence: string }>;
  recommendations: Array<{ option: string; score: number; reasons: string[]; tradeoffs: string[]; next_action: string }>;
  next_actions: string[];
}

export async function getRelocationPlan() {
  return apiFetch<RelocationPlan>("/plan");
}

export async function askAgent(question: string, location?: UserProfile["location"]) {
  return apiFetch<AgentAnswer>("/agent/query", {
    method: "POST",
    body: JSON.stringify({ question, location: location ?? null }),
  });
}

export async function generateTasks(force: boolean, location?: UserProfile["location"]) {
  return apiFetch<AgentTaskResponse>("/tasks/generate", {
    method: "POST",
    body: JSON.stringify({ force, location: location ?? null }),
  });
}

export async function completeAgentTask(taskId: string) {
  return apiFetch<{ completed: boolean }>("/tasks/complete", {
    method: "POST",
    body: JSON.stringify({ task_id: taskId }),
  });
}

export interface RewardsState {
  points: number;
  streak: number;
  completed_tasks: number;
  level: string;
}

export async function getRewards() {
  return apiFetch<RewardsState>(`/rewards/${getUserId()}`);
}
export async function redeemReward(title: string, points: number) {
  return apiFetch<{ redeemed: boolean; rewards: RewardsState }>("/rewards/redeem", { method: "POST", body: JSON.stringify({ title, points }) });
}

export interface CheckinResponse {
  message: string;
  response: string;
  phase_name: string;
  day_number: number;
  mood?: number;
  note?: string;
  created_at?: string;
}

export async function submitCheckin(payload: {
  day_number: number;
  transition_type: string;
  mood: number;
  note: string;
  profile?: UserProfile;
}) {
  return apiFetch<CheckinResponse>("/checkins", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface CheckinStatus {
  checked_in: boolean;
  latest: CheckinResponse | null;
  required_date: string;
}

export async function getCheckinStatus() {
  return apiFetch<CheckinStatus>(`/checkins/status/${getUserId()}`);
}

export async function getCheckinHistory() {
  return apiFetch<{ entries: CheckinResponse[]; count: number }>("/checkins/history");
}

export async function login(email: string, password: string) {
  return apiFetch<{ session: { access_token: string }; user: { id: string } }>("/auth/login", {
    method: "POST", body: JSON.stringify({ email, password }),
  });
}

export interface ResearchResult {
  id: string; name: string; category: string; latitude: number; longitude: number;
  address: string; phone?: string; website?: string; opening_hours?: string;
  map_url: string; directions_url: string; source_url: string; source_type: string; retrieved_at: string; rating?: number; review_count?: number; price_level?: string; summary?: string;
}

export async function researchCategory(category: string, params: Record<string, string | number> = {}) {
  const query = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)]));
  return apiFetch<{ category: string; query: string; source: string; location_label?: string; results: ResearchResult[]; warning?: string; budget_warning?: string; request?: Record<string, unknown> }>(`/research/${category}?${query}`);
}

export async function verifySource(url: string) {
  return apiFetch<{ url: string; extraction: { facts: Record<string, string>; provenance: Record<string, { value: string; confidence: string; source: string }>; confidence: string } }>("/sources/verify", { method: "POST", body: JSON.stringify({ url }) });
}

export async function confirmSource(url: string, category: string, facts: Record<string, string>, confidence: string) {
  return apiFetch<{ saved: boolean }>("/sources/confirm", { method: "POST", body: JSON.stringify({ url, category, facts, confidence }) });
}

export interface CardOption {
  name: string; issuer: string; card_type: string; annual_fee: string; joining_fee: string;
  interest_rate: string; forex_fee: string; rewards: string; eligibility: string;
  best_for: string; caution: string; source_url: string;
}
export async function getBankingOptions(purpose: string) {
  return apiFetch<{ summary: string; affordability_note: string; options: CardOption[]; checked_at: string }>("/banking/options", { method: "POST", body: JSON.stringify({ purpose }) });
}
export async function planCommute(origin: string, destination: string, profile: string) {
  return apiFetch<{ distance_m: number; duration_s: number; source: string; origin: { name: string; address: string }; destination: { name: string; address: string } }>("/routing/plan", { method: "POST", body: JSON.stringify({ origin, destination, profile }) });
}
