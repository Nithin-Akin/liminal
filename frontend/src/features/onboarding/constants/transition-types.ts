import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  CloudRain,
  HeartCrack,
  HeartPulse,
  UserRound,
} from "lucide-react";

export enum TransitionType {
  NEW_CITY = "new_city",
  CAREER = "career",
  DIVORCE = "divorce",
  HEALTH = "health",
  GRIEF = "grief",
  IDENTITY = "identity",
}

export interface TransitionTypeOption {
  id: TransitionType;
  label: string;
  icon: LucideIcon;
}

/**
 * Options shown on the Transition Selection screen.
 * Order matches the design reference (2-column grid, 3 rows).
 */
export const TRANSITION_TYPES: TransitionTypeOption[] = [
  { id: TransitionType.NEW_CITY, label: "New City", icon: Building2 },
  { id: TransitionType.CAREER, label: "Career", icon: Briefcase },
  { id: TransitionType.DIVORCE, label: "Divorce", icon: HeartCrack },
  { id: TransitionType.HEALTH, label: "Health", icon: HeartPulse },
  { id: TransitionType.GRIEF, label: "Grief", icon: CloudRain },
  { id: TransitionType.IDENTITY, label: "Identity", icon: UserRound },
];
