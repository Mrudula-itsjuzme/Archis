# Archis Technical Architecture

## Principle

The building is the source of truth. 2D, 3D, constraints, intent hypotheses and alternatives are projections or reasoning layers over that model.

```text
architect-authored draft
        ↓
semantic building graph
        ├── geometry
        ├── topology / relationships
        ├── hard constraints
        └── intent hypotheses
                ↓
        architect confirms / corrects
                ↓
          protected intent model
                ↓
             change request
                ↓
      candidate transformation engine
                ↓
    constraint + semantic-distance scoring
                ↓
        impact explanation / comparison
                ↓
           architect decision
```

## 1. Semantic building model

Current MVP entities are intentionally simple: project, building, level, space, door and furniture. The engine should progressively move walls, openings and richer topology into first-class entities rather than burying them inside view code.

## 2. Intent model

An `IntentHypothesis` contains a kind, strength, confidence, involved entities, rationale and architect decision.

The confidence means `Archis thinks this may matter`, not `this is architectural truth`.

States:

- `UNREVIEWED`: system hypothesis
- `PROTECT`: architect says preserve this during the requested change
- `IGNORE`: architect says this relationship is incidental for the current task

Later we can add architect-authored/rephrased intent rather than forcing every idea into system-generated labels.

## 3. Semantic design distance

A candidate is not ranked only by whether it passes constraints.

Conceptually:

`D = wg*geometry + wt*topology + wi*intent + wp*performance`

The MVP implements geometry, topology and intent terms. Weights are provisional and must not be presented as scientifically validated.

This lets Archis ask a different question from blank-slate generation:

> Of the valid ways to satisfy this new request, which ones disturb the architect-authored design least?

## 4. Change impact

Every candidate should produce a structured report across:

- geometry: areas, movement, dimensions
- relationships: adjacency, reachability, zoning
- constraints: pass/fail and violations
- intent: protected ideas strengthened, preserved or weakened

The UI should expose consequences rather than simply flashing a red invalid-state badge.

## 5. Candidate generation

The current engine is deterministic on purpose. It proves the loop without hiding correctness behind an LLM.

Next candidate generation should be local and transformation-based:

1. identify entities affected by request
2. enumerate small legal transformations
3. propagate dependencies
4. reject hard-constraint failures
5. score semantic distance
6. return a small Pareto-like set of meaningfully different trade-offs

An LLM may parse a natural-language request into structured goals, but deterministic geometry and constraints remain authoritative.

## 6. Learning from correction

A correction is useful evidence only when scoped correctly.

We should distinguish:

- project-specific intent
- architect-specific repeated preferences
- universal constraints / code

Do not casually turn one architect's preference into a global design rule.

## 7. Integration wedge

Archis should not require a studio to abandon Revit/Archicad/etc. to test the thesis.

Initial boundary:

`import / reconstruct early plan → reason and iterate in Archis → approved revision → handoff/export`

If validation shows architects want the reasoning inside an existing tool, the semantic/intent engine can become an integration rather than forcing a new authoring environment.

## 8. Trust boundary

Never phrase inferred intent as fact. Show confidence and rationale. Keep architect decisions visible. Hard constraints and geometry must remain inspectable and deterministic. When the system cannot infer why a relationship exists, asking is better than pretending.
