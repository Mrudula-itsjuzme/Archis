# Archis Validation Plan

## The thing we are actually testing

Archis is not being validated by asking whether architects think an AI architecture product sounds interesting.

The hypothesis is narrower:

> Given an architect-authored draft and a requested change, can a system identify relationships the architect considers intentional, let the architect correct those hypotheses, and produce/explain revisions that preserve those relationships better than naive alternatives?

## Study 0: do architects agree that the problem exists?

Recruit 5–8 practicing architects. Include at least four who are not family, teammates, or close collaborators.

Give each architect one of their own early residential plans and ask them to make a realistic change such as adding 2–3 m² to a kitchen, increasing bedroom privacy, or accommodating a changed client requirement.

Before they edit, ask them to mark:

- things that absolutely cannot change
- relationships they strongly want to preserve
- preferences they would trade away if necessary
- geometry that is merely incidental

Do not show Archis's inferred labels first. This gives us a reference instead of training the answer into the participant.

## Study 1: intent inference

Archis receives the same draft without the architect's annotations and produces intent hypotheses with confidence values.

Measure:

- precision of proposed important relationships
- recall against architect-marked relationships
- calibration: does 80% confidence actually correspond to roughly 80% confirmation?
- number of hypotheses the architect protects, ignores, or rewrites
- time required to correct the intent model

### Early success criterion

Do not claim success from a tiny sample. For the prototype, continue only if architects repeatedly confirm that the hypotheses capture useful relationships and correction takes less effort than restating the design from scratch.

## Study 2: minimal-change revision

For each change request, compare:

A. naive geometry/constraint-satisfying edit
B. Archis edit after intent confirmation
C. architect's own revision

Blind the architect to A/B labels where practical.

Ask:

1. Does this satisfy the requested change?
2. Which important ideas from the original survived?
3. Which were damaged?
4. Would you continue editing this alternative?
5. Which explanation was actually useful?

Record hard-constraint satisfaction, semantic design distance, accepted/rejected alternatives, corrections, and time-to-useful-revision.

## Study 3: impact explanations

Show an edit and compare a conventional message such as `Bedroom area changed` against an Archis-style consequence explanation such as `Kitchen expansion is feasible, but this option narrows circulation and weakens the separation between the bedroom wing and social zone.`

Measure whether the explanation helps the architect identify the trade-off correctly and whether it changes their decision.

## Kill criteria

Archis should change direction if repeated testing shows any of these:

- architects do not recognize stable intent/invariants in early drafts
- explicitly marking intent is faster than correcting inferred hypotheses
- minimal-change alternatives are not useful in real revisions
- semantic impact explanations repeat things architects already see immediately
- architects overwhelmingly prefer these capabilities inside their existing BIM/CAD environment rather than a separate workspace

The last result does not kill the engine. It changes the product wedge toward a plugin/integration.

## Data we should keep

With explicit participant permission, retain anonymized pairs of:

`original draft → architect intent annotations → change request → generated alternatives → architect decision/correction`

This is potentially more valuable than collecting arbitrary floor plans because it captures what changed, what mattered, and why a professional accepted or rejected the change.

## What not to report yet

Until these studies exist, do not claim:

- Archis understands architectural intent
- Archis preserves intent better than existing tools
- architects save X% of iteration time
- architects prefer Archis
- the intent model is accurate

For now those are hypotheses. The prototype exists to make them falsifiable.
