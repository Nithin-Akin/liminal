import {
  createMockLoginResponse,
  createMockRegisterResponse,
  MOCK_AUTH_DELAY_MS,
} from "@/mocks/auth.mock";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
} from "@/types";

/**
 * Authenticates a user with email and password.
 *
 * Sprint 1: returns mock data after a simulated delay.
 * Future: POST /api/auth/login
 */
export async function login(
  _credentials: LoginCredentials,
): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_AUTH_DELAY_MS));

  return createMockLoginResponse();
}

/**
 * Registers a new user with name, email, and password.
 *
 * Sprint 1: returns mock data after a simulated delay.
 * Future: POST /api/auth/register
 */
export async function register(
  credentials: RegisterCredentials,
): Promise<RegisterResponse> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_AUTH_DELAY_MS));

  return createMockRegisterResponse(credentials);
}
