import type { LucideIcon } from "lucide-react";
import {
  Clock,
  CloudFog,
  Compass,
  Frown,
  HandHeart,
  HeartHandshake,
  HelpCircle,
  Smile,
  Sparkles,
  Users,
} from "lucide-react";

export interface QuestionOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface QuestionnaireQuestion {
  id: string;
  question: string;
  options: QuestionOption[];
}

/**
 * Five-question intake form (PB-04 / US-02).
 * Content is illustrative — review exact wording with the team before launch.
 */
export const QUESTIONNAIRE: QuestionnaireQuestion[] = [
  {
    id: "current_feeling",
    question: "How are you feeling lately?",
    options: [
      { id: "calm", label: "Calm", icon: Smile },
      { id: "lost", label: "Lost", icon: CloudFog },
      { id: "hopeful", label: "Hopeful", icon: Sparkles },
      { id: "unsure", label: "Unsure", icon: HelpCircle },
    ],
  },
  {
    id: "support_level",
    question: "How much support do you feel you have right now?",
    options: [
      { id: "a_lot", label: "A lot", icon: Users },
      { id: "some", label: "Some", icon: HeartHandshake },
      { id: "a_little", label: "A little", icon: HandHeart },
      { id: "none", label: "None right now", icon: Frown },
    ],
  },
  {
    id: "sense_of_control",
    question: "How in control do you feel of this transition?",
    options: [
      { id: "very", label: "Very in control", icon: Compass },
      { id: "somewhat", label: "Somewhat", icon: Compass },
      { id: "not_much", label: "Not much", icon: CloudFog },
      { id: "not_at_all", label: "Not at all", icon: HelpCircle },
    ],
  },
  {
    id: "biggest_weight",
    question: "What's weighing on you the most right now?",
    options: [
      { id: "uncertainty", label: "Uncertainty", icon: HelpCircle },
      { id: "loneliness", label: "Loneliness", icon: Frown },
      { id: "time_pressure", label: "Time pressure", icon: Clock },
      { id: "everything", label: "A bit of everything", icon: CloudFog },
    ],
  },
  {
    id: "readiness",
    question: "How ready do you feel to take next steps?",
    options: [
      { id: "very_ready", label: "Very ready", icon: Sparkles },
      { id: "somewhat_ready", label: "Somewhat ready", icon: Smile },
      { id: "not_yet", label: "Not yet", icon: CloudFog },
      { id: "overwhelmed", label: "Overwhelmed", icon: Frown },
    ],
  },
];
