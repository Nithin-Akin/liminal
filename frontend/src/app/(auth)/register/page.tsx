import type { Metadata } from "next";

import { RegisterScreen } from "@/features/auth/components/RegisterScreen";

export const metadata: Metadata = {
  title: "Create account | Liminal",
  description: "Create your Liminal account and start your transition journey.",
};

export default function RegisterPage() {
  return <RegisterScreen />;
}
