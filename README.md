<p align="center">
  <img src="docs/assets/archis-hero.svg" alt="Archis — intent-aware architecture workspace" width="100%" />
</p>

# Archis

> **The architect authors the design. Archis helps the design survive change.**

Archis is an early architecture-software research prototype built around a narrower question than “can AI generate a floor plan?”

**Can software begin from an architect-authored draft, infer which relationships appear intentional, ask when it is uncertain, and help make later changes while preserving what mattered in the original design?**

<p>
  <img alt="Stage" src="https://img.shields.io/badge/stage-active%20prototype-2c2c2c?style=flat-square" />
  <img alt="Focus" src="https://img.shields.io/badge/focus-intent--preserving%20iteration-2c2c2c?style=flat-square" />
  <img alt="React" src="https://img.shields.io/badge/React-18-2c2c2c?style=flat-square&logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-2c2c2c?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Three.js" src="https://img.shields.io/badge/Three.js-semantic%203D-2c2c2c?style=flat-square&logo=threedotjs&logoColor=white" />
</p>

---

## The short version

A building changes constantly after its first draft. A room grows. A client changes a requirement. A wall moves. A code or site constraint appears. The difficult question is not only whether the new geometry is valid. It is whether the change quietly destroyed the idea the architect was trying to preserve.

```text
ARCHITECT'S FIRST DRAFT
          ↓
semantic building representation
          ↓
intent hypotheses + explicit constraints
          ↓
"Is this what you meant?"
          ↓
architect confirms / corrects
          ↓
change request
          ↓
minimal-change alternatives
          ↓
impact explanation
          ↓
architect accepts / edits / rejects
```

Archis treats the first draft as **evidence of intent**, not merely geometry to redraw.

---

## What is actually new here?

Not 2D ↔ 3D synchronization. Not semantic walls. Not BIM. Not “AI for architects.” Mature BIM and newer design systems already cover substantial parts of those problems.

The hypothesis Archis is testing is more specific:

> **Given an existing architect-authored design and a new requirement, can a system identify likely design invariants and produce the smallest useful change that satisfies the new requirement without unnecessarily destroying those invariants?**

That turns the problem from **generation** into **intent-preserving transformation**.

### Example

An architect's plan may explicitly say:

```text
Bedroom >= 12 m²
Kitchen adjacent to dining
Structural wall locked
```

But the drawing may also suggest things nobody typed into a constraint panel:

```text
courtyard anchors the social spaces
private rooms are screened from the entrance
entry compresses before opening into living
exact bathroom geometry is comparatively flexible
```

Archis should not pretend it knows those things with certainty. It should form hypotheses:

```text
INFERRED INTENT

high confidence    kitchen ↔ dining adjacency appears deliberate
high confidence    bedrooms form a privacy zone
medium confidence  courtyard appears to anchor social spaces
low confidence     bathroom position appears significant

                   [protect] [ignore] [edit]
```

The architect remains the authority.

---

## Why this is not “just BIM”

BIM already gives buildings semantic objects and coordinated representations. Archis depends on that idea rather than claiming to invent it.

The research problem sits one level above representation:

```text
What exists?        → semantic model
What is legal?      → hard constraints
What is preferred?  → soft priorities
What did THIS
architect mean?     → intent hypotheses
What will this
change disturb?     → semantic impact analysis
What is the least
destructive edit?   → minimal-change search
```

The goal is not another universal BIM platform. The initial wedge is the messy **iteration loop around an existing early design**.

---

## Why now, when the market is already crowded?

The market is moving quickly, which is exactly why Archis cannot rely on broad claims.

- Revit and Archicad already provide model-centric BIM and coordinated views.
- Autodesk Forma is pushing further into early schematic exploration and generative layout workflows.
- Snaptrude now combines an editable connected model with AI-assisted programming, site analysis, generation and BIM workflows.
- Finch encodes firm design systems, plan libraries, rules and constraints to generate and adapt layouts.
- Research systems such as HouseMind already unify floor-plan understanding, generation and editing.

So **connected models, controllable generation and architect-in-the-loop AI are becoming table stakes.**

The remaining question Archis cares about is not “can the machine make more options?” It is:

> **Can it understand enough about the option the architect already chose to know what should survive the next edit?**

That is still a hypothesis, not a solved claim.

See [`docs/RESEARCH_THESIS.md`](docs/RESEARCH_THESIS.md) for the competitive and research framing.

---

## The research model

Archis currently separates five kinds of information:

```text
BUILDING MODEL
├── geometry
├── topology
├── semantic entities
├── explicit constraints
└── design priorities
```

The proposed research layer adds:

```text
INTENT MODEL
├── inferred invariant
├── strength / priority
├── confidence
├── evidence
└── architect confirmation
```

An edit can then be evaluated as more than valid/invalid.

A future design-distance objective could look like:

```text
D' = best candidate satisfying the new requirement

while minimizing:

geometry change
+ topology change
+ intent loss
+ unwanted experiential change
```

The exact representation and weighting are **open research questions**, not implemented facts.

---

## Semantic impact analysis

Suppose the architect asks:

> Increase the kitchen by 15%.

The interesting output is not only the moved wall.

```text
Kitchen expands
     ↓
Dining shrinks
     ↓
Circulation narrows
     ↓
Door position changes
     ↓
Entrance sightline changes
     ↓
Original spatial hierarchy may weaken
```

Archis should eventually be able to say something closer to:

> This change is geometrically feasible, but it weakens two relationships you previously marked important. Here are three smaller alternatives.

That is the product interaction the project is moving toward.

---

## What exists today

Archis currently has a deliberately small semantic-interaction MVP:

- interactive 2D room-plan workspace
- linked 3D semantic extrusion
- shared semantic model independent of either view
- live deterministic hard-constraint evaluation
- bedroom minimum-area checks
- kitchen ↔ living adjacency check
- substantial-overlap detection
- deterministic design variants
- semantic explanation / status UI
- Zustand-backed shared state

### Current deterministic variants

- **Preserve** — normalizes the base design while preserving its broad layout structure
- **More Private** — shifts private spaces away from the public zone
- **More Compact** — reduces selected dimensions while protecting current hard thresholds

These variants **do not yet infer latent architectural intent**. They are scaffolding for testing the interaction model.

That distinction matters.

---

## Product workspace concept

<p align="center">
  <img src="docs/assets/workspace-concept.svg" alt="Archis product workspace concept" width="100%" />
</p>

The interface should make the building feel like one object being inspected from several angles. The long-term UI should make uncertainty visible rather than hiding it behind an AI answer.

A useful future panel is not simply “AI suggestions.” It is **What I think you are protecting**, with confidence and architect correction.

> The visual above is a product-direction mockup. It is not a claim that every shown control is implemented.

---

## Architect first, AI second

Archis is deliberately **not**:

> “Give me a site and brief and I will design the building for you.”

The architect makes the first move because the first draft contains judgment that may never become a clean numeric constraint.

The intended loop is:

1. architect creates or imports a first concept,
2. Archis reconstructs its semantic structure,
3. explicit constraints are attached,
4. the system proposes hypotheses about less-explicit intent,
5. architect confirms or corrects them,
6. architect requests a change,
7. Archis searches for nearby alternatives,
8. consequences and trade-offs are explained,
9. architect decides.

AI can help with interpretation and search. Deterministic geometry and constraint logic should remain verifiable wherever possible.

---

## The hard problems

The interesting work begins where the current prototype ends.

### 1. Latent intent inference
Distinguish deliberate relationships from incidental geometry.

### 2. Intent hierarchy
Represent **must preserve**, **strong preference**, **weak preference**, and **free to change** rather than flattening everything into binary constraints.

### 3. Uncertainty
A system should be able to say “I am not sure this mattered” and ask the architect.

### 4. Semantic design distance
Define what “smallest change” means when two geometrically similar plans may differ greatly in architectural intent.

### 5. Impact propagation
Explain the architectural consequences of an edit, not merely the objects whose coordinates changed.

### 6. Preference learning
Use architect corrections to learn project-specific priorities without turning them into an opaque style model.

---

## Architecture today

```text
┌─────────────────────────────────────────┐
│                UI / VIEWS               │
│        2D Editor       3D Viewer        │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│        CANONICAL SEMANTIC MODEL         │
│      rooms • relations • geometry       │
└───────────────────┬─────────────────────┘
                    │
          ┌─────────┴──────────┐
          ▼                    ▼
┌──────────────────┐  ┌──────────────────┐
│ Constraint Engine│  │ Variant Explorer │
└──────────────────┘  └──────────────────┘
          │                    │
          └─────────┬──────────┘
                    ▼
          semantic explanations
```

### Current stack

| Layer | Current choice |
| --- | --- |
| App | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS |
| 3D | Three.js + React Three Fiber + Drei |
| State | Zustand |
| Icons | Lucide React |
| Constraint logic | deterministic TypeScript engine |
| Variant generation | deterministic transformations over the semantic model |

---

## Validation before expansion

The next milestone is not “add more AI.” It is finding out whether the problem is real.

The first tests should use real architect-authored residential plans and real revision requests.

Measure:

- which relationships architects mark as intentional,
- whether Archis can predict those relationships before confirmation,
- calibration: when Archis is uncertain, is it actually less likely to be right?
- how often generated edits preserve architect-confirmed invariants,
- time to complete common revisions with and without assistance,
- how many suggestions are accepted, edited, or rejected,
- whether architects return voluntarily for another revision task.

The founder connection to a practicing architect gives access to an initial test user. **It is not market validation.**

---

## Roadmap

### Phase 0 — semantic interaction prototype ✓ / active
- [x] shared semantic model
- [x] editable 2D representation
- [x] linked 3D representation
- [x] hard constraints
- [x] deterministic alternatives
- [x] explanation UI
- [ ] stronger entity semantics and propagation

### Phase 1 — architect-authored plan experiments
- [ ] collect real first-draft → revision pairs with permission
- [ ] annotate deliberate vs incidental relationships
- [ ] build intent-hypothesis UI
- [ ] measure agreement with architects
- [ ] test confidence calibration

### Phase 2 — minimal-change engine
- [ ] explicit hard / soft / free-to-change hierarchy
- [ ] semantic design-distance baseline
- [ ] local search around an authored plan
- [ ] semantic impact explanations
- [ ] compare against naive constraint-only optimization

### Phase 3 — learn from corrections
- [ ] project-specific preference model
- [ ] decision history / rationale
- [ ] architect corrections as feedback
- [ ] explainable alternative ranking

### Phase 4 — only after the wedge works
- [ ] richer walls / doors / windows / topology
- [ ] IFC / BIM handoff
- [ ] professional pilot workflow
- [ ] collaboration and versioning where demanded

---

## What Archis is not claiming

- that BIM lacks semantic objects
- that 2D/3D synchronization is new
- that generative floor plans are new
- that “human-in-the-loop AI” is sufficient novelty
- that the current prototype understands architectural intent
- that architects want this workflow before it has been validated
- that Archis should replace Revit, Archicad, Snaptrude, Forma or Finch end-to-end

Archis is a **testable thesis**, not a victory lap.

---

## One sentence

**Archis starts from an architect-authored design, learns what appears important enough to protect, and aims to make later changes with the smallest possible loss of the original intent.**

---

## Reading / market context

The thesis is intentionally framed against what exists today rather than pretending the field is empty:

- [Snaptrude AI: AI that designs with you](https://www.snaptrude.com/blog/announcing-snaptrude-ai)
- [Finch: design systems, constraints and plan libraries](https://www.finch3d.com/product)
- [Autodesk Forma Building Layout Explorer](https://adsknews.autodesk.com/en/news/building-layout-explorer-in-autodesk-forma/)
- [HouseMind, CVPR 2026: understanding, generating and editing floor plans](https://openaccess.thecvf.com/content/CVPR2026/html/Qin_Tokenization_Allows_Multimodal_Large_Language_Models_to_Understand_Generate_and_CVPR_2026_paper.html)

A deeper framing and falsifiable research plan lives in [`docs/RESEARCH_THESIS.md`](docs/RESEARCH_THESIS.md).

<sub>Archis is an active prototype. Current implementation, research hypotheses, and future product direction are deliberately separated throughout this README.</sub>
