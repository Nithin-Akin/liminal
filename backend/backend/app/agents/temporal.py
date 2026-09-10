from app.core.phases import get_phase as phase_definition

def get_phase(day_number: int) -> dict:
    phase = phase_definition(day_number)
    return {"day_number": max(1, min(90, day_number)), "phase_name": phase.name, "phase_context": phase.context}
