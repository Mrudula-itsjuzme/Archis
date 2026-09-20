# Archis Competitive Landscape

> Working document. Last research pass: September 2026. Product capabilities change quickly; re-verify before external claims.

## The uncomfortable starting point

Archis is **not novel because it has semantic rooms and walls, linked 2D/3D views, constraints, parametric edits, or design alternatives**. Mature BIM and newer concept-design systems already cover substantial parts of that stack.

The useful question is therefore not “who else does architecture software?” but:

> **Who starts from an architect-authored draft, identifies which properties appear intentional, asks the architect to resolve uncertainty, and then helps make the smallest useful change while explaining what the change damages or preserves?**

That is the gap Archis should test rather than assume.

## Competitive map

| Product / workflow | What it already makes dangerous for Archis | Remaining question for Archis |
| --- | --- | --- |
| Autodesk Revit | Model-centric BIM, semantic building elements, coordinated views, parametric relationships, documentation | Can an intent-first reasoning layer make early revisions easier without asking firms to abandon Revit? |
| Graphisoft Archicad | Mature BIM model, linked documentation/views, semantic objects and professional delivery workflow | Same: Archis cannot sell “one model / many views” as novelty |
| Autodesk Forma | Early-stage/site analysis and increasingly generative schematic exploration | Can Archis operate *after the architect authors a concept*, rather than optimize from a brief/site? |
| Snaptrude | Cloud-native conceptual/BIM workflow, connected model, collaboration, AI direction explicitly framed around architects | Probably the closest product-level threat. Archis needs a sharper intent-inference/minimal-change thesis, not “modern BIM” |
| Finch | Rules, constraints, design systems, adaptive plan reuse and variant exploration; explicitly discusses encoded design intent | Archis must distinguish inferred/project-specific intent from designer-authored rules/templates |
| TestFit | Rapid site/configuration generation and feasibility from constraints/economics | Archis should not compete on “generate lots of feasible options” |
| Rhino + Grasshopper | Extremely flexible parametric/algorithmic design and optimization | Archis would need to make reasoning accessible without requiring architects to construct the parametric logic themselves |
| SketchUp | Familiar, low-friction conceptual 3D workflow with enormous ecosystem | Adoption friction matters more than theoretical capability; an Archis wedge must coexist with familiar tools |
| AutoCAD | Entrenched drafting workflows and file exchange | Archis cannot assume firms will migrate because its model is conceptually cleaner |
| Planner 5D / consumer tools | Accessible plan/3D workflows and AI-assisted visualization | Not the target buyer; useful warning against becoming a consumer room generator |
| Hypar and related computational-design platforms | Programmatic building generation and reusable functions | Reinforces that generation/automation alone is not a moat |

## The closest research/product territory

Recent floor-plan research already covers human-guided generation, constraint-conditioned layouts, multimodal understanding/editing, and plan-to-structured-model reconstruction. Therefore these phrases are **not defensible novelty claims on their own**:

- human-in-the-loop architectural AI
- controllable floor-plan generation
- semantic floor-plan understanding
- editable generated plans
- constraint-aware design
- preserving “design intent” as a generic phrase

The narrower Archis hypothesis is:

> Given an architect-authored design and a requested change, can a system infer a calibrated hierarchy of likely design invariants, let the architect correct that interpretation, and produce/explain minimal semantic changes that satisfy the new requirement while preserving the confirmed intent?

## What could actually differentiate Archis

### 1. Latent intent inference

Do not ask architects to encode every rule before the system becomes useful. Infer hypotheses from the authored design and surrounding project information.

### 2. Uncertainty as product behavior

Archis should say “I think this relationship matters” rather than pretending it understands architecture with certainty. The architect can protect, weaken, edit, or dismiss each hypothesis.

### 3. Project-specific intent hierarchy

Represent intent as graded priorities rather than a flat constraint list:

- invariant / must preserve
- strong preference
- weak preference
- apparently incidental
- unknown

### 4. Minimal-change transformation

Optimize around the architect’s existing scheme rather than returning unrelated alternatives. “Give the kitchen 3 m² more while disturbing the rest of my idea as little as possible” is more specific than “generate another plan.”

### 5. Semantic impact analysis

After an edit, explain consequences beyond geometry: area, adjacency, circulation, privacy zoning, protected relationships, daylight proxies, and confirmed project intent.

### 6. Learning from corrections

An architect rejecting or manually repairing a proposed revision is evidence about the project’s priorities. Store that as explicit, inspectable project knowledge rather than opaque personalization.

## Why not just a Revit plugin?

It might be.

That is an architectural/business decision to validate, not an ideological one. If the valuable component is intent inference + semantic impact analysis + minimal-change search, integration with existing BIM may be a much better first business than forcing migration to a new authoring environment.

A standalone prototype is still useful because it lets us test the interaction and representation without inheriting a large incumbent API surface.

## Why now?

The enabling pieces are improving simultaneously: multimodal models can reason over drawings and text more effectively, structured geometric representations can constrain generation, and architects are being exposed to increasingly capable generative tools. That does **not** prove demand. It makes the unresolved human-control problem more visible and technically testable.

## Competitive kill test

Archis should be reconsidered or radically repositioned if a current product can already demonstrate all of the following in ordinary practice:

1. begin with the architect’s authored plan rather than a blank generative brief,
2. infer important spatial/design relationships without requiring all of them to be manually encoded,
3. expose confidence/uncertainty and let the architect correct the inferred intent,
4. accept a requested design change,
5. generate minimal-change alternatives conditioned on confirmed intent,
6. explain semantic consequences and what was preserved/damaged,
7. learn project priorities from subsequent architect corrections.

If that workflow is already solved well, “we have a nicer interface” is not enough.