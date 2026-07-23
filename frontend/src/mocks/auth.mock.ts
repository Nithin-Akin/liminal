import type { LoginResponse, RegisterCredentials, RegisterResponse } from "@/types";

/** Simulated network latency for realistic loading states. */
export const MOCK_AUTH_DELAY_MS = 800;

export function createMockLoginResponse(): LoginResponse {
  return {
    success: true,
    token: "mock-jwt",
    user: {
      id: "1",
      name: "Demo User",
    },
  };
}

export function createMockRegisterResponse(
  credentials: RegisterCredentials,
): RegisterResponse {
  return {
    success: true,
    token: "mock-jwt",
    user: {
      id: "1",
      name: credentials.name,
    },
  };
}
