export type TransitionType = "moving_city" | "career" | "grief" | "divorce" | "diagnosis" | "coming_out";

export interface UserProfile {
  name: string;
  ageRange: string;
  genderContext: string;
  transitionType: TransitionType;
  city: string;
  locality: string;
  destination: string;
  monthlyBudget: number;
  housingStatus: string;
  bankStatus: string;
  simStatus: string;
  commuteMode: string;
  foodPreference: string;
  safetyPriority: string;
  supportLevel: string;
  dayOne: string;
  intakeNote: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface RecommendationOption {
  name: string;
  fields: Record<string, string | number>;
  why: string;
  sourceUrl: string;
  sourceType: "official" | "open-data" | "search-link" | "seeded";
  lastChecked: string;
}

export interface RecommendationGroup {
  id: string;
  title: string;
  whyNow: string;
  columns: string[];
  options: RecommendationOption[];
}
