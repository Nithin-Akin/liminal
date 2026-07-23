import type { Metadata } from "next";

import { TransitionSelectionScreen } from "@/features/onboarding/components/TransitionSelectionScreen";

export const metadata: Metadata = {
  title: "What are you going through? | Liminal",
  description: "Select the transition you're navigating right now.",
};

export default function TransitionSelectionPage() {
  return <TransitionSelectionScreen />;
}
