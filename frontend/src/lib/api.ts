import type { UserProfile } from "@/types/app";

export const USER_ID = "demo-user";
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
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
    body: JSON.stringify({ user_id: USER_ID, profile }),
  });
}

export async function getDashboard() {
  return apiFetch<DashboardState>(`/dashboard/${USER_ID}`);
}

export async function askAgent(question: string, location?: UserProfile["location"]) {
  return apiFetch<AgentAnswer>("/agent/query", {
    method: "POST",
    body: JSON.stringify({ user_id: USER_ID, question, location: location ?? null }),
  });
}

export async function generateTasks(force: boolean, location?: UserProfile["location"]) {
  return apiFetch<AgentTaskResponse>("/tasks/generate", {
    method: "POST",
    body: JSON.stringify({ user_id: USER_ID, force, location: location ?? null }),
  });
}

export async function completeAgentTask(taskId: string) {
  return apiFetch<{ completed: boolean }>("/tasks/complete", {
    method: "POST",
    body: JSON.stringify({ user_id: USER_ID, task_id: taskId }),
  });
}

export interface RewardsState {
  points: number;
  streak: number;
  completed_tasks: number;
  level: string;
}

export async function getRewards() {
  return apiFetch<RewardsState>(`/rewards/${USER_ID}`);
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
    body: JSON.stringify({ user_id: USER_ID, ...payload }),
  });
}

export interface CheckinStatus {
  checked_in: boolean;
  latest: CheckinResponse | null;
  required_date: string;
}

export async function getCheckinStatus() {
  return apiFetch<CheckinStatus>(`/checkins/status/${USER_ID}`);
}
