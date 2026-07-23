import type { Metadata } from "next";

import { QuestionnaireScreen } from "@/features/onboarding/components/QuestionnaireScreen";

export const metadata: Metadata = {
  title: "A few questions | Liminal",
  description: "Help us personalize your transition journey.",
};

export default function QuestionnairePage() {
  return <QuestionnaireScreen />;
}
