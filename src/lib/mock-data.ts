export interface UserProfile {
  name: string;
  city: string;
  moveDate: string;
  dayNumber: number;
  totalDays: number;
  phase: TransitionPhase;
}

export type TransitionPhase =
  | "honeymoon"
  | "reality"
  | "loneliness"
  | "adjustment"
  | "integration";

export interface ArcPhase {
  id: TransitionPhase;
  label: string;
  days: string;
  description: string;
  color: string;
  insight: string;
}

export interface MoodOption {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export interface CheckInPrompt {
  id: string;
  question: string;
  type: "mood" | "scale" | "text";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface DayFeedPost {
  id: string;
  author: string;
  dayNumber: number;
  city: string;
  content: string;
  likes: number;
  timeAgo: string;
  tag?: string;
}

export interface CityCircle {
  id: string;
  name: string;
  members: number;
  nextEvent?: string;
  description: string;
}

export interface ScoutResource {
  id: string;
  category: "housing" | "bank" | "doctor" | "food" | "transport";
  title: string;
  subtitle: string;
  rating: number;
  distance: string;
  badge?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  href: string;
  color: string;
}

export interface InsightCard {
  id: string;
  title: string;
  body: string;
  type: "warning" | "encouragement" | "tip";
}

export const MOCK_USER: UserProfile = {
  name: "Nithin",
  city: "Bengaluru",
  moveDate: "2026-03-08",
  dayNumber: 19,
  totalDays: 90,
  phase: "loneliness",
};

export const ARC_PHASES: ArcPhase[] = [
  {
    id: "honeymoon",
    label: "Honeymoon",
    days: "Day 1–7",
    description: "Everything feels exciting and new.",
    color: "#fb923c",
    insight: "Enjoy the energy — but don't sign long leases yet.",
  },
  {
    id: "reality",
    label: "Reality Check",
    days: "Day 8–17",
    description: "The novelty fades. Practical tasks pile up.",
    color: "#a78bfa",
    insight: "Prioritise bank account, SIM, and a local doctor.",
  },
  {
    id: "loneliness",
    label: "The Dip",
    days: "Day 18–28",
    description: "Loneliness often peaks here. This is normal.",
    color: "#6366f1",
    insight: "What you feel is documented, temporary, and shared by millions.",
  },
  {
    id: "adjustment",
    label: "Adjustment",
    days: "Day 29–60",
    description: "Routines form. The city starts to feel familiar.",
    color: "#22c55e",
    insight: "Small rituals — a café, a walk — anchor you faster than big plans.",
  },
  {
    id: "integration",
    label: "Integration",
    days: "Day 61–90",
    description: "You belong here. The transition is complete.",
    color: "#14b8a6",
    insight: "Consider mentoring someone just starting their Day 1.",
  },
];

export const MOOD_OPTIONS: MoodOption[] = [
  { id: "great", label: "Great", emoji: "✨", color: "#22c55e" },
  { id: "okay", label: "Okay", emoji: "🙂", color: "#a78bfa" },
  { id: "low", label: "Low", emoji: "😔", color: "#6366f1" },
  { id: "rough", label: "Rough", emoji: "😞", color: "#f97316" },
  { id: "crisis", label: "Struggling", emoji: "🆘", color: "#ef4444" },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hey Nithin — Day 19. You're in what research calls 'the dip.' How are you feeling today?",
    timestamp: "9:00 AM",
  },
  {
    id: "2",
    role: "user",
    content: "Honestly pretty lonely. Everyone at work seems to have their friend groups already.",
    timestamp: "9:02 AM",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "That feeling at Day 18–22 is one of the most documented patterns in relocation research — not a sign you made the wrong choice. Would you like me to find a City Circle meetup this weekend, or talk through what's been hardest?",
    timestamp: "9:02 AM",
  },
];

export const DAY_FEED: DayFeedPost[] = [
  {
    id: "1",
    author: "Priya",
    dayNumber: 21,
    city: "Bengaluru",
    content:
      "Day 21 and I finally cried in the metro. Then I looked around and realised half the people looked just as tired. We're all figuring it out.",
    likes: 47,
    timeAgo: "2h ago",
    tag: "Day 18–28",
  },
  {
    id: "2",
    author: "Arjun",
    dayNumber: 12,
    city: "Bengaluru",
    content:
      "Pro tip: opened a zero-balance account at Karnataka Bank in Koramangala — no minimum balance, took 20 mins with Aadhaar.",
    likes: 89,
    timeAgo: "5h ago",
    tag: "Practical",
  },
  {
    id: "3",
    author: "Meera",
    dayNumber: 45,
    city: "Bengaluru",
    content:
      "Update: I have a favourite chai spot now. Took 6 weeks but the city finally feels like mine, not just a place I'm visiting.",
    likes: 124,
    timeAgo: "8h ago",
    tag: "Hope",
  },
];

export const CITY_CIRCLES: CityCircle[] = [
  {
    id: "1",
    name: "Koramangala Newcomers",
    members: 234,
    nextEvent: "Saturday brunch, 11 AM",
    description: "For people who moved to Koramangala in the last 90 days.",
  },
  {
    id: "2",
    name: "Tech First-Job Bangalore",
    members: 512,
    nextEvent: "Wednesday coworking, 6 PM",
    description: "Young professionals in their first role in the city.",
  },
  {
    id: "3",
    name: "Day 15–30 Support",
    members: 89,
    nextEvent: "Sunday walk, Cubbon Park",
    description: "Exactly when the loneliness dip hits. You're not alone.",
  },
];

export const SCOUT_RESOURCES: ScoutResource[] = [
  {
    id: "1",
    category: "bank",
    title: "Karnataka Bank — Koramangala",
    subtitle: "Zero balance · Aadhaar only · 20 min setup",
    rating: 4.6,
    distance: "1.2 km",
    badge: "Best match",
  },
  {
    id: "2",
    category: "doctor",
    title: "Practo — Dr. Ananya Sharma",
    subtitle: "General physician · ₹500 consult · English/Hindi",
    rating: 4.8,
    distance: "0.8 km",
  },
  {
    id: "3",
    category: "food",
    title: "Meghana Foods",
    subtitle: "Affordable South Indian · ₹150/meal · Open till 11 PM",
    rating: 4.5,
    distance: "0.5 km",
  },
  {
    id: "4",
    category: "housing",
    title: "NoBroker — 1BHK Koramangala",
    subtitle: "₹18,000/mo · Semi-furnished · No brokerage",
    rating: 4.2,
    distance: "2.1 km",
  },
  {
    id: "5",
    category: "transport",
    title: "Namma Metro — Green Line",
    subtitle: "Nearest: Koramangala (500m) · ₹30–₹60 rides",
    rating: 4.7,
    distance: "0.5 km",
  },
];

export const HOME_INSIGHTS: InsightCard[] = [
  {
    id: "1",
    title: "You're in the dip",
    body: "Day 18–22 is when loneliness peaks for most relocators. This phase is temporary and well-documented.",
    type: "encouragement",
  },
  {
    id: "2",
    title: "Decision check",
    body: "You mentioned a 11-month lease yesterday. Major commitments made during the dip often get regretted. Want to talk it through?",
    type: "warning",
  },
];

export function getPhaseForDay(day: number): TransitionPhase {
  if (day <= 7) return "honeymoon";
  if (day <= 17) return "reality";
  if (day <= 28) return "loneliness";
  if (day <= 60) return "adjustment";
  return "integration";
}

export function getPhaseLabel(phase: TransitionPhase): string {
  return ARC_PHASES.find((p) => p.id === phase)?.label ?? phase;
}
