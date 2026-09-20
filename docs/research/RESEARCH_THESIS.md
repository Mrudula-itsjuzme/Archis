# Archis Research Thesis

**Status:** active product research direction, September 2026  
**Product context:** Archis is being developed as an architect-first design product, not only as a research demo.  
**Research discipline:** implemented product behavior, heuristic prototypes, and unproven research claims are separated below.

## Core question

Architecture software is already good at representing buildings, generating options, checking constraints, and synchronizing views.

Archis is testing a narrower and harder question:

> **When an architect has already made a design, can software help that design change without casually destroying the relationships that made it that design?**

The product therefore starts from an **architect-authored partial design**, turns it into a semantic and versioned building state, and supports later changes as reviewable transformations rather than blank-slate regeneration.

The research wedge is not “AI architecture.” It is **continuity under revision**.

## Product thesis vs research thesis

These are related but not identical.

### Product thesis

Archis should let an architect continue working on their own design through one coherent semantic state:

```text
architect draft / imported plan
        ↓
canonical semantic building state
        ↓
2D + 3D + constraints + project context
        ↓
requested change
        ↓
small, reviewable patch
        ↓
impact / trade-off explanation
        ↓
architect accepts, edits, rejects, or reverts
        ↓
versioned project history
```

AI can interpret, rank, explain, and propose. It should not become the source of truth for geometry or professional constraints.

### Research thesis

Within that product loop, Archis is testing whether a system can:

1. infer which observable relationships in a specific authored design are likely intentional,
2. represent uncertainty instead of pretending certainty,
3. let the architect correct that interpretation,
4. use confirmed intent when generating or ranking candidate revisions,
5. explain what each revision preserves, weakens, or breaks,
6. learn project-specific preferences from later architect corrections.

The research contribution is therefore closer to an **architect-correctable design-intent graph + semantic revision distance + reviewable patch workflow** than to a generative floor-plan model.

## What is explicitly not novel

Archis must not claim novelty for:

- semantic walls, rooms, doors, windows, or BIM-style objects,
- linked 2D and 3D representations,
- parametric editing,
- constraint-aware generation,
- human-in-the-loop design tools,
- natural-language CAD,
- floor-plan understanding or editing,
- AI-assisted early design,
- firm rules, templates, or design systems,
- “design intent” as a generic phrase.

BIM, Revit/Archicad, Snaptrude, Finch, Autodesk Forma, computational design systems, and recent academic work already occupy substantial parts of that space.

The interesting gap is whether software can preserve **project-specific meaning that is only partially explicit in the authored design**.

## Why a first draft contains more than geometry

An early plan contains at least four kinds of information:

```text
HARD FACTS
code, geometry, locked structure, explicit dimensions

EXPLICIT PREFERENCES
brief requirements, architect-entered priorities

LATENT RELATIONSHIPS
privacy zoning, social adjacency, sequence, anchors, circulation logic

INCIDENTAL STATE
geometry that exists but is not important to preserve
```

The technical problem is that latent relationships and incidental state can look identical in raw geometry.

For example:

```text
Observable fact                     Possible meaning
──────────────────────────────────────────────────────────
Courtyard touches living            deliberate social anchor
Bedrooms cluster away from entry    deliberate privacy zoning
Kitchen touches dining              deliberate adjacency
Entry narrows before living         deliberate sequence
Bathroom wall is 3.82 m long        probably incidental
```

Archis should not convert “possible meaning” directly into truth. It should expose a hypothesis.

## Design-intent graph

The long-term representation should be an inspectable graph over the canonical building state.

```text
IntentNode / IntentEdge
├── subject entities
├── relationship / proposition
├── strength
├── confidence
├── evidence
├── source
│   ├── inferred
│   ├── explicit
│   ├── imported
│   └── learned-from-correction
├── scope
│   ├── this change
│   ├── this project
│   └── repeated architect preference
└── architect decision
    ├── protect
    ├── prefer
    ├── incidental
    ├── edit
    └── unknown
```

This is deliberately inspectable. A hidden “style embedding” may become useful later, but it is not sufficient as the product contract.

## Research problem 1: intent inference

### Question

Can Archis identify relationships an architect later confirms as important from the plan, brief, project state, and interaction history?

### Baselines

1. geometry-only heuristics,
2. topology / adjacency heuristics,
3. explicit brief and constraints only,
4. multimodal plan + brief model,
5. multimodal model + project history.

### Current implementation

Archis already contains deterministic intent hypotheses for the demo model and an architect-facing inspector. Those hypotheses are **heuristic scaffolding**, not a validated inference model.

### Evaluation

Measure:

- precision / recall for architect-confirmed relationships,
- ranking agreement for importance,
- confidence calibration,
- correction burden,
- stability of labels across repeated review,
- whether the architect can explain why a hypothesis is wrong.

A high accuracy score with poor calibration is not enough. Archis must know when to ask.

## Research problem 2: semantic revision distance

“Smallest change” cannot mean only coordinate distance.

Two designs can be geometrically similar while differing strongly in privacy, circulation, hierarchy, or a protected relationship.

A starting formulation is:

```text
RevisionDistance(D, D') =
    α · geometry_change
  + β · topology_change
  + γ · confirmed_intent_loss
  + δ · circulation_or_experience_change
  + ε · downstream_constraint_impact
```

The research question is whether architect-confirmed semantic distance predicts professional judgment better than geometry-only distance or constraint satisfaction alone.

## Research problem 3: reviewable local transformation

Given:

- current design state D,
- requested change R,
- hard constraints H,
- confirmed / explicit intent I,

find a small set of candidate patches P such that:

```text
R(apply(D, P)) is satisfied
H(apply(D, P)) is satisfied
IntentLoss(D, apply(D, P)) is minimized
UnnecessaryChange(D, apply(D, P)) is minimized
```

The key word is **patch**.

Archis should prefer local, inspectable transformations over replacing the entire design with a new generated answer.

## Research problem 4: semantic impact propagation

A change can propagate through several layers:

```text
wall move
→ room dimensions / area
→ openings
→ adjacency
→ circulation
→ sightline / zoning / access
→ hard or soft constraints
→ protected relationships
→ downstream design decisions
```

Archis should distinguish:

- deterministic geometric effects,
- deterministic constraint effects,
- analysis-derived effects,
- uncertain interpretive effects.

Explanations should preserve those confidence boundaries.

## Research problem 5: learning from correction

The useful signal is not merely “proposal rejected.”

A correction can reveal a trade-off:

```text
privacy > floor-area efficiency
courtyard relationship > shortest circulation
southern opening preserved
service geometry flexible
```

The system should store those decisions as inspectable project knowledge.

Project-specific preferences must not silently become global architectural rules.

## Current implementation boundary

### Implemented today

The current web prototype includes:

- canonical shared semantic state used by 2D and 3D views,
- editable 2D geometry and linked 3D representation,
- wall / vertex graph work and blueprint overlay/calibration,
- deterministic constraints and design variants,
- first-class `IntentHypothesis` data structures,
- deterministic intent-hypothesis generation for the demo state,
- Intent Inspector with architect decisions,
- deterministic change-request exploration for a constrained demo case,
- structured change-impact logic,
- Gemini-backed blueprint extraction and recommendation endpoints,
- Firebase authentication and project persistence,
- 2D SVG and 3D GLTF export paths.

### Implemented but not scientifically validated

- intent confidence values,
- semantic-distance weights,
- some privacy / relationship proxies,
- deterministic candidate quality,
- AI extraction reliability across arbitrary plans.

### Not yet proven

- general latent intent inference,
- calibrated uncertainty,
- useful intent inference across different architects and building types,
- architect preference for intent-aware revisions over direct manual editing,
- time savings in real practice,
- reliable minimal-change optimization at professional scale,
- interoperability quality with professional CAD/BIM workflows,
- repeated willingness to use or pay.

## Product boundary

Archis is **not** intended to become:

- a prompt-to-building generator,
- an “AI architect,”
- a rendering-first product,
- a full structural/MEP solver,
- a universal code-compliance engine,
- a generic consumer floor-plan app,
- a Revit replacement on day one,
- an LLM wrapper over CAD commands.

The intended product is an **architect-first revision and reasoning layer** around a canonical building state.

The current repository is a web prototype. The longer-term product direction may become an installable/offline-first desktop workflow, but that transition must preserve the same engine boundaries rather than fork the product into a different thesis.

## Falsifiable experiments

### Experiment A: is intent inference useful?

Use real architect-authored projects and ask authors to annotate deliberate, negotiable, and incidental relationships before seeing Archis predictions.

Compare against geometry/topology baselines.

**Failure signal:** the learned system is not materially better than simple rules, or correcting it costs as much as explicitly restating the intent.

### Experiment B: does intent-aware revision beat simpler editing?

For a real change request compare:

A. constraint-only candidate  
B. geometry-minimizing candidate  
C. intent-aware candidate  
D. architect's own manual revision

Measure:

- confirmed relationships preserved,
- amount of manual correction,
- time to acceptable revision,
- architect continuation choice,
- explanation usefulness.

**Failure signal:** C does not improve professional outcomes over A/B.

### Experiment C: is uncertainty useful?

Compare:

A. silent assumptions,  
B. ask about everything,  
C. confidence-gated clarification.

Measure correction burden and downstream error.

**Goal:** ask fewer, higher-value questions.

### Experiment D: is the product loop useful beyond the demo?

Have design partners use the system on multiple real revision episodes.

Measure:

- second-project / second-revision return,
- revision time,
- number of manual rebuild steps avoided,
- accepted vs edited vs rejected patches,
- export / handoff completion,
- failure points that push them back to existing tools.

A cool first demo is not validation. Repeated use is.

## Defensibility, if earned

Potential defensibility is not “we use AI.”

It could emerge from:

1. architect-confirmed project intent graphs,
2. revision histories containing accepted/rejected trade-offs,
3. an evaluation benchmark for continuity under change,
4. a robust semantic transformation engine,
5. professional interoperability,
6. trust UX around uncertainty, provenance, and reviewable patches.

The “data moat” should be treated as a possible consequence of a useful workflow, not the reason users should adopt Archis.

## Kill / pivot conditions

Archis should change direction if repeated evidence shows:

- architects do not experience revision continuity as a painful problem,
- explicit constraints are sufficient and intent inference adds little,
- architects strongly prefer direct manual editing to reviewing patches,
- clarification burden outweighs saved effort,
- semantic explanations restate obvious information,
- existing products solve the same job well enough,
- interoperability cost dominates the value,
- users enjoy the demo but do not return with another real project.

If architects want the reasoning engine inside an existing authoring tool, that is not automatically a research failure. It may imply an integration/plugin product rather than a standalone authoring environment.

## One-line research question

> **Can software preserve continuity in an architect's own design by turning uncertain intent into architect-correctable project knowledge and using it to make smaller, explainable revisions?**
