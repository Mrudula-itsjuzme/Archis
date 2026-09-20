# Archis Validation Plan

**Status:** active, September 2026  
**Goal:** validate a real product workflow, not collect compliments about an AI demo.

## What we are testing

The central product hypothesis is:

> Architects lose time and design continuity when an already-authored concept changes, and a semantic, reviewable revision workflow can reduce that cost without taking authority away from the architect.

The research hypothesis inside that loop is:

> Architect-correctable intent hypotheses can help Archis produce or rank revisions that preserve what mattered better than geometry-only or constraint-only alternatives.

Both hypotheses must survive real project use.

## Validation principles

1. **Use real project histories where possible.** A single artificial kitchen-resize demo is useful for engineering, not market validation.
2. **Observe revision work before pitching Archis.** Learn how architects currently rebuild, reconcile, compare, and communicate changes.
3. **Separate problem evidence from solution enthusiasm.**
4. **Measure repeated use.** “Cool idea” is weak evidence. A second real revision is much stronger.
5. **Capture why a proposal was changed or rejected.** That is the valuable signal.
6. **Do not train participants into our thesis.** Collect their intent/decision structure before showing Archis labels.

## Stage 0: design-partner interviews

Target the first ~20 serious conversations around real projects rather than generic “would you use AI?” interviews.

For each architect, reconstruct one recent change episode:

- What was the original design state?
- What changed in the brief/client/site/constraints?
- Which parts of the original design were non-negotiable?
- Which parts were flexible?
- What had to be rebuilt or reconciled?
- Which tools were involved?
- Where did information get lost between sketch, plan, 3D, client feedback, and BIM?
- How long did the revision take?
- What did the architect need to check again?
- What explanation or diff would have reduced uncertainty?

Record the current workflow, not only opinions.

### Evidence we want

- recurring revision pain,
- repeated rebuild/reconciliation steps,
- lost or implicit design rationale,
- frequent tool/context switching,
- revisions where “valid” was not the same as “acceptable,”
- willingness to bring a second real project.

## Stage 1: concierge intent study

Before relying on learned inference, test the interaction manually or with simple heuristics.

For one authored design, ask the architect to identify:

- hard invariants,
- strong preferences,
- negotiable preferences,
- incidental geometry,
- uncertain relationships.

Then show a small set of Archis hypotheses.

Measure:

- confirmed / edited / rejected hypotheses,
- time to correct the model,
- whether correction feels easier than restating the design,
- whether the resulting representation is useful during a later revision.

The goal is not to prove AI accuracy. It is to validate whether an intent layer is worth having.

## Stage 2: inference benchmark

Once the interaction is useful, compare:

A. geometry-only heuristic  
B. topology/adjacency heuristic  
C. brief + explicit constraints  
D. multimodal model  
E. multimodal model + project history

Ground truth comes primarily from the author of the plan.

Measure:

- precision / recall,
- ranking agreement,
- confidence calibration,
- correction burden,
- consistency across repeated review.

Avoid publishing a flattering “accuracy” number if the sample is tiny or labels are unstable.

## Stage 3: revision comparison

For each real change request compare:

A. constraint-only edit  
B. geometry-minimizing edit  
C. intent-aware reviewable patch  
D. architect's own manual revision

Where practical, blind A/B/C labels.

Measure:

- requested change satisfied,
- hard constraints preserved,
- confirmed relationships preserved,
- amount of manual correction,
- time to acceptable revision,
- whether the architect chooses to continue from the candidate,
- explanation usefulness.

## Stage 4: product-loop pilot

Run Archis across multiple revision episodes, not one scripted task.

A pilot should include:

```text
import/open project
→ inspect semantic state
→ correct extraction if needed
→ make/edit intent decisions
→ request or perform a change
→ review patch + impact
→ accept/edit/reject
→ save version
→ reopen later
→ export/handoff
```

Track where the user abandons Archis and returns to existing tools. Those exits are product requirements.

## Metrics that matter

### Problem metrics

- revision frequency,
- rebuild/reconciliation steps per revision,
- number of tools touched,
- time spent re-checking consequences,
- repeated communication loops.

### Product metrics

- successful import / reconstruction rate,
- correction time,
- time to first useful revision,
- accepted / edited / rejected patch ratio,
- revert rate,
- successful export / handoff rate,
- repeated use on another revision/project.

### Research metrics

- intent precision / recall,
- confidence calibration,
- semantic-distance agreement with architect judgment,
- protected-relation preservation,
- manual correction after candidate generation.

## Study populations

Start narrow enough to learn quickly:

- practicing architects,
- small studios,
- architecture students only as secondary usability participants,
- early residential / small-building projects initially.

Do not treat family access, teammates, or architecture students as market validation by themselves.

Later expand deliberately into apartments, schools, stations, larger complexes, and other building types only after the core revision loop survives narrower testing.

## Data to retain

Only with explicit permission, retain structured/anonymized records such as:

```text
original design state
→ project brief/context
→ architect-confirmed intent
→ change request
→ candidate patches
→ impact reports
→ architect decision
→ manual correction
→ final accepted state
```

This is more useful than accumulating arbitrary floor plans because it captures **decision continuity**.

## Kill / pivot criteria

Change direction if repeated testing shows:

- architects do not care about continuity enough to change workflow,
- intent correction is slower than direct editing,
- simple constraints explain nearly all useful decisions,
- generated/recommended patches rarely become starting points,
- impact explanations add little,
- extraction correction is too expensive,
- users refuse to bring a second real project,
- interoperability friction overwhelms the value.

If users clearly want the reasoning layer embedded inside Revit/Archicad/Snaptrude instead of a standalone product, treat that as a product-form signal, not automatically a thesis failure.

## Claims we must not make yet

Do not claim:

- Archis understands architectural intent,
- Archis preserves intent better than existing tools,
- Archis saves a specific percentage of time,
- architects prefer Archis,
- the intent model is calibrated,
- the system is production-safe for professional documentation,
- the product has a moat,
- willingness to pay has been proven.

## Near-term validation output

For each design partner, create one evidence packet containing:

1. current revision workflow,
2. original design state,
3. requested change,
4. architect-labeled priorities,
5. Archis hypotheses,
6. candidate/revision comparison,
7. accepted/rejected decisions,
8. correction notes,
9. measured time/effort,
10. whether they will use it again.

That packet is more valuable than another polished demo video.
