import type { Metadata } from "next";

import { ArcRevealScreen } from "@/features/onboarding/components/ArcRevealScreen";

export const metadata: Metadata = {
  title: "Your journey has begun | Liminal",
  description: "Your personalized transition arc is ready.",
};

export default function ArcRevealPage() {
  return <ArcRevealScreen />;
}