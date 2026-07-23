import type { Metadata } from "next";

import { LoginScreen } from "@/features/auth/components/LoginScreen";

export const metadata: Metadata = {
  title: "Login | Liminal",
  description: "Login to continue your transition journey.",
};

export default function LoginPage() {
  return <LoginScreen />;
}