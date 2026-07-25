PHASES = {
    (1, 7):   ("Landing",   "Initial shock and excitement. Adrenaline is high. Everything feels new and slightly overwhelming. Energy is up but exhaustion is underneath."),
    (8, 28):  ("Reality",   "The adrenaline has worn off. The weight of the change feels real. Loneliness can peak here. Practical tasks pile up. This is the most documented difficult phase."),
    (29, 60): ("Adjusting", "Slow routines are forming. Identity disruption peaks — who am I in this new place? Small wins start to appear. Support from home starts to feel more distant."),
    (61, 90): ("Emerging",  "A new normal is forming. The city starts feeling like yours. Confidence returning. Some days still hard but the trajectory is clear."),
}

def get_phase(day_number: int) -> dict:
    for (start, end), (phase, context) in PHASES.items():
        if start <= day_number <= end:
            return {
                "day_number": day_number,
                "phase_name": phase,
                "phase_context": context
            }
    return {
        "day_number": day_number,
        "phase_name": "Emerging",
        "phase_context": "Journey nearing completion. Reflect on how far you have come."
    }