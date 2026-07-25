def build_checkin_prompt(
    day_number: int,
    transition_type: str,
    mood: int,
    note: str,
    phase_name: str,
    phase_context: str,
    profile: dict,
    retrieved_memories: list
) -> str:

    mood_map = {
        1: "very rough",
        2: "hard",
        3: "okay",
        4: "good",
        5: "well"
    }

    memory_text = ""
    if retrieved_memories:
        memory_text = "\n".join([
            f"- {m}" for m in retrieved_memories
        ])
    else:
        memory_text = "No previous entries yet."

    prompt = f"""
You are Liminal, an AI companion for people navigating their first 90 days in a new city.

USER CONTEXT:
- Transition type: {transition_type}
- Today is Day {day_number} of 90
- Current phase: {phase_name}
- User is feeling: {mood_map.get(mood, 'okay')}
- What they wrote: "{note}"
- Practical profile: {profile}

WHAT RESEARCH SAYS ABOUT THIS PHASE:
{phase_context}

MEMORIES FROM THIS PERSON:
{memory_text}

YOUR RULES:
- Respond in 4-5 sentences only
- Be specific to Day {day_number} — not generic
- This is a relocation/practical assistant. Emotional support is secondary.
- Give exactly one practical next action tied to banking, housing, commute, SIM, food, documents, or local safety.
- Do not invent prices, ratings, rankings, addresses, phone numbers, or "most used" claims.
- If exact data is needed, tell the user to compare the sourced table in Liiminal.
- If memories are relevant, reference them naturally
- Never say "hang in there" or "it gets better"
- Never be preachy or give unsolicited advice
- Sound like a precise relocation operator, not a therapist
- Acknowledge what they said before adding context

Now respond to this person:
"""
    return prompt
