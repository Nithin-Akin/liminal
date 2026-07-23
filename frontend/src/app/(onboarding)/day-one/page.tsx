import type { Metadata } from "next";

import { DayOneScreen } from "@/features/onboarding/components/DayOneScreen";

export const metadata: Metadata = {
  title: "Day One | Liminal",
  description: "Mark when your transition began.",
};

export default function DayOnePage() {
  return <DayOneScreen />;
}
