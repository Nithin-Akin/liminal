from dataclasses import dataclass


@dataclass(frozen=True)
class Phase:
    name: str
    start: int
    end: int
    context: str


PHASES = (
    Phase("Landing", 1, 14, "Initial setup: documents, SIM, safe housing, food, and low-friction routines."),
    Phase("Reality", 15, 35, "Practical systems: banking, commute, housing comparison, and predictable routines."),
    Phase("Adjustment", 36, 65, "Optimize housing, healthcare, recurring payments, and local support."),
    Phase("Emerging", 66, 90, "Build durable systems, stronger networks, and financial reliability."),
)


def get_phase(day_number: int) -> Phase:
    day = max(1, min(90, int(day_number)))
    return next(phase for phase in PHASES if phase.start <= day <= phase.end)
