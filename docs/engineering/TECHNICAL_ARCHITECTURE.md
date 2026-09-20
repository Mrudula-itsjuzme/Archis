# Archis Technical Architecture

## Product architecture principle

**The canonical building state is the source of truth.**

2D, 3D, AI interpretations, constraints, intent, change proposals, exports, and project history are views or reasoning layers over that state.

No UI surface or model response should become a competing source of geometry.

```text
architect input / imported draft
          ↓
canonical semantic + versioned building state
          ├── geometry graph
          ├── spaces / openings / objects
          ├── topology / relationships
          ├── hard constraints
          ├── project metadata
          └── provenance
          ↓
reasoning layers
          ├── intent hypotheses
          ├── AI extraction / interpretation
          ├── deterministic analyses
          └── recommendations
          ↓
change request / direct edit
          ↓
candidate patch engine
          ↓
validation + semantic impact
          ↓
reviewable diff
          ↓
accept / edit / reject / revert
          ↓
new project version
```

## 1. Canonical semantic model

The product should evolve toward explicit first-class entities for:

- project,
- building,
- level,
- space,
- wall,
- opening,
- door/window,
- furniture/object,
- geometry vertices/edges,
- semantic relationships,
- constraints,
- versions / revisions.

The current code already contains shared semantic state, room/space structures, geometry graph work, and linked 2D/3D behavior.

### Rule

A change to geometry should flow through the canonical model and then be reflected in every view.

Do not patch 2D and 3D separately.

## 2. Geometry and topology engine

Geometry must remain deterministic and testable.

Responsibilities include:

- vertex/wall graph operations,
- snapping/calibration,
- room boundary reconstruction,
- adjacency,
- overlap/intersection checks,
- opening placement,
- area/dimension computation,
- dependency propagation,
- export conversion.

AI may propose a change. It should not be trusted to perform authoritative geometry mutation without validation.

## 3. Constraint engine

Constraints should be typed and provenance-aware.

```text
Constraint
├── kind
├── target entities
├── hard | soft
├── source
│   ├── architect
│   ├── brief
│   ├── imported
│   ├── code
│   └── system
├── evaluator
└── explanation
```

Hard constraints should be deterministic wherever possible.

A language model may translate text into a candidate structured constraint, but the constraint engine owns evaluation.

## 4. Intent graph

The current code already contains `IntentHypothesis` structures and heuristic inference.

That is the first implementation of a broader project-intent graph.

Each item should eventually carry:

- involved entities,
- relationship,
- strength,
- confidence,
- rationale/evidence,
- provenance,
- scope,
- architect decision,
- version introduced/changed.

Important separation:

```text
INFERRED ≠ CONFIRMED
CONFIRMED ≠ HARD CONSTRAINT
PROJECT PREFERENCE ≠ UNIVERSAL RULE
```

## 5. AI boundary

AI is useful for:

- blueprint/drawing interpretation,
- natural-language request parsing,
- proposing semantic labels,
- proposing intent hypotheses,
- ranking candidate patches,
- explanation,
- summarizing consequences.

AI should not be the final authority for:

- geometry validity,
- hard constraints,
- version state,
- destructive mutation,
- professional code compliance.

The current Gemini serverless endpoints are an implementation detail, not the architecture itself. Keep provider-specific code behind service boundaries.

## 6. Change model: patches, not replacement

A requested change should produce one or more explicit operations.

Example:

```text
Patch
├── id
├── base_version
├── operations[]
│   ├── move_vertex
│   ├── move_wall
│   ├── resize_space
│   ├── add/remove opening
│   └── update semantic relation
├── requested_goal
├── validation_result
├── impact_report
├── provenance
└── status
    ├── proposed
    ├── accepted
    ├── edited
    ├── rejected
    └── reverted
```

This creates a clean foundation for review, undo, collaboration, and learning from corrections.

## 7. Semantic revision distance

Candidate ranking should not collapse to one opaque “AI score.”

Conceptually:

```text
distance =
  geometry delta
+ topology delta
+ protected-intent loss
+ downstream constraint impact
+ selected performance/experience terms
```

Weights must be inspectable and versioned.

The current deterministic semantic-distance/impact logic is prototype scaffolding and should be treated as provisional.

## 8. Impact engine

For every patch, compute a structured diff:

- geometry changed,
- spaces affected,
- topology changed,
- constraints passed/failed,
- protected intent preserved/weakened,
- openings/circulation affected,
- uncertain interpretive consequences.

The UI should show **what happened and why it matters**, not only a red/green validity badge.

## 9. Versioning and project memory

Product-scale Archis needs explicit project history.

At minimum:

```text
ProjectVersion
├── parent_version
├── canonical state snapshot or delta
├── author
├── timestamp
├── accepted patch
├── architect notes
└── intent/constraint changes
```

This is the substrate for:

- undo/revert,
- collaboration,
- decision provenance,
- comparison,
- learning from accepted/rejected trade-offs.

Firebase currently provides authentication and persistence for the prototype. Persistence technology can change; version semantics should not depend on Firebase-specific behavior.

## 10. Current deployment boundary

The current repository is a React + TypeScript + Vite web application with serverless API routes.

Current stack includes:

- React 18,
- TypeScript,
- Vite,
- Zustand,
- Three.js / React Three Fiber,
- Firebase auth/persistence,
- serverless Gemini endpoints,
- deterministic TypeScript geometry/constraint/revision logic.

The longer-term product may become installable/offline-first, especially for professional drawing workflows and private project data. If that happens, the engine should move behind portable interfaces rather than being rewritten around a desktop shell.

## 11. Interoperability boundary

The first product does not need to replace Revit, Archicad, AutoCAD, Rhino, or SketchUp.

Target flow:

```text
import / reconstruct
→ work in canonical Archis state
→ review revisions
→ export / handoff
```

SVG/GLTF exports are current prototype steps. Professional interoperability will eventually need stronger 2D/BIM formats and preservation of semantic/provenance data.

## 12. Trust and safety rules

- Never present inferred intent as fact.
- Never hide an AI-driven destructive edit.
- Keep geometry/constraint validation inspectable.
- Preserve provenance.
- Make revert/undo cheap.
- Prefer asking over inventing when uncertainty is material.
- Do not silently generalize one architect's preference to everyone.
- Do not claim professional compliance unless a deterministic compliance module actually verified it.

## 13. Engineering boundaries for contributors

Prefer modules shaped roughly as:

```text
src/models        domain types
src/engine        deterministic geometry/constraints/patch logic
src/services      AI, persistence, import/export adapters
src/store         application orchestration/state
src/components    presentation + interaction
api/              server-side provider adapters
```

Engine code should avoid direct UI imports and direct provider dependencies.

As the team grows, new features should extend the canonical model and patch/impact flow rather than adding isolated state to whichever component needs it first.

## 14. Architecture success condition

The architecture is working when:

> a contributor can implement a new change operation once, validate it once, and have 2D, 3D, impact analysis, version history, export, and AI reasoning all observe the same resulting state.

If every feature requires synchronizing multiple ad-hoc representations, the architecture is drifting.
