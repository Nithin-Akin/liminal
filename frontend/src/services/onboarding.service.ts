import type { TransitionType } from "@/features/onboarding/constants/transition-types";

export interface SaveTransitionTypePayload {
  transitionType: TransitionType;
}

export interface SaveTransitionTypeResponse {
  success: boolean;
}

export interface SaveDayOnePayload {
  startDate: Date;
}

export interface SaveDayOneResponse {
  success: boolean;
}

export interface SaveQuestionnairePayload {
  /** Maps question id -> selected option id. */
  answers: Record<string, string>;
}

export interface SaveQuestionnaireResponse {
  success: boolean;
}

/**
 * Saves the user's selected transition type.
 * Maps to: POST /api/user/transition (see backlog integration table).
 *
 * TODO(backend): implement the real request. Mocked for now so the
 * frontend flow is fully clickable during development.
 */
export async function saveTransitionType(
  payload: SaveTransitionTypePayload,
): Promise<SaveTransitionTypeResponse> {
  console.log("[Liminal Onboarding] Saving transition type:", payload);

  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 500);
  });
}

/**
 * Saves the user's Day One (transition start) date.
 * Maps to: POST /api/user/day-one (see backlog integration table).
 *
 * TODO(backend): implement the real request. Mocked for now so the
 * frontend flow is fully clickable during development.
 */
export async function saveDayOne(
  payload: SaveDayOnePayload,
): Promise<SaveDayOneResponse> {
  console.log("[Liminal Onboarding] Saving Day One:", payload);

  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 500);
  });
}

/**
 * Saves the user's intake questionnaire answers.
 * Maps to: POST /api/questionnaire (see backlog integration table).
 *
 * TODO(backend): implement the real request. Mocked for now so the
 * frontend flow is fully clickable during development.
 */
export async function saveQuestionnaire(
  payload: SaveQuestionnairePayload,
): Promise<SaveQuestionnaireResponse> {
  console.log("[Liminal Onboarding] Saving questionnaire answers:", payload);

  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 500);
  });
}
