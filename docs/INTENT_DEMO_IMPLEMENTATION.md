# Intent-Preservation Demo: Implemented Slice

This branch turns the research thesis into an inspectable product primitive without claiming the full research problem is solved.

## Implemented

- first-class `IntentHypothesis` model with confidence, strength, rationale and architect decision
- deterministic hypothesis extraction for the current demo model
- architect-facing Intent Inspector with **Protect** and **Incidental** decisions
- semantic design-distance representation
- structured change-impact report across geometry, topology, hard constraints and protected intent
- deterministic comparison logic in `src/engine/intent.ts`
- Intent tab integrated into the existing right sidebar

## Deliberately provisional

The current intent inference is heuristic. Confidence values are demo hypotheses, not learned or calibrated probabilities. Semantic-distance weights are provisional. Privacy impact uses geometric separation as a simple proxy. These exist so the interaction can be tested with architects before spending time training a model around assumptions that may be wrong.

## Next implementation slice

1. Replace fixed confidence values with measurable features and an explicit calibration path.
2. Add a `Change Request` action, starting with **Give the kitchen ~3 m² more area**.
3. Enumerate local deterministic transformations around affected spaces.
4. Run hard constraints and semantic-distance scoring over candidates.
5. Show 2–3 candidates with the impact report beside each.
6. Record architect accept/reject/manual-correction events.

## Demo truthfulness

During a pitch, say **Archis proposes intent hypotheses**. Do not say **Archis understands intent**.

The current code proves that architect-confirmable intent can be represented, carried alongside the semantic building model and used in impact scoring. Whether the inferred hypotheses are useful is exactly what the validation plan is designed to test.
