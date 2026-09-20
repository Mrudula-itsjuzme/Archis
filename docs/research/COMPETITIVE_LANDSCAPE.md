# Archis Competitive Landscape

> **Working document. Last strategic pass: September 2026. Re-verify before external claims because architecture software is moving quickly.**

## Positioning rule

Archis must not compete on a slogan that incumbents already satisfy.

These are **not** sufficient differentiation:

- “AI for architects,”
- semantic building objects,
- one model behind 2D and 3D,
- BIM in the cloud,
- constraint-aware generation,
- natural-language editing,
- floor-plan understanding,
- human-in-the-loop generation,
- firm-specific templates,
- generic “design intent.”

The sharper product question is:

> **Can Archis continue an architect's own partial design as a semantic, versioned, AI-editable building state and make later changes as minimal, reviewable patches that preserve selected relationships?**

The research question inside that product is whether some of those relationships can be inferred reliably enough to reduce manual restatement.

## Competitive map

| Product / workflow | What it already does well | Implication for Archis |
| --- | --- | --- |
| Autodesk Revit | Mature BIM, semantic model, parametric relationships, documentation, ecosystem | “One model / many views” is infrastructure, not novelty |
| Graphisoft Archicad | Mature BIM authoring and coordinated documentation | Archis must coexist with professional delivery workflows |
| Autodesk Forma | Early-stage analysis, schematic design, generation, Autodesk handoff | Autodesk is the existential platform threat if Archis becomes generic early-design AI |
| Snaptrude | Connected conceptual/BIM model, collaboration, AI workflows, architect-controlled positioning | Closest product-level comparator; Archis needs a sharper revision/continuity loop |
| Finch | Rules, constraints, reusable firm knowledge, adaptive plan exploration | Firm intelligence and encoded intent are not unique claims |
| TestFit | Fast feasibility/configuration generation | Do not compete on option volume |
| Rhino + Grasshopper | Deep parametric/computational design control | Archis must provide useful structure without requiring users to build the algorithm themselves |
| SketchUp | Familiar early-design workflow and ecosystem | Adoption friction matters as much as model sophistication |
| AutoCAD | Entrenched drafting and exchange | Migration cannot be assumed |
| Hypar / computational platforms | Programmatic building generation and reusable functions | Automation alone is not a moat |
| Consumer plan tools | Accessible plan/3D generation and visualization | Avoid drifting into consumer-room-generator territory |

## Closest strategic threats

### Snaptrude

Snaptrude is dangerous because it already combines many things an early Archis pitch might accidentally claim as unique: connected models, early design, BIM direction, collaboration, and architect-facing AI.

Archis should not position against Snaptrude with “AI + BIM.”

The differentiating test is:

```text
existing architect-authored state
→ project-specific protected relationships
→ requested revision
→ local reviewable patches
→ impact/provenance
→ architect correction
→ project memory
```

If Snaptrude already solves that loop well in ordinary practice, Archis needs a different wedge.

### Finch

Finch weakens any claim based on “encoding design intent,” design systems, rules, or reusable firm knowledge.

Archis's remaining question is whether **project-specific intent can be inferred and negotiated from a particular authored design**, instead of being primarily predefined as templates/rules.

### Autodesk

Autodesk is not only a feature competitor. It has distribution, file standards, Revit, Forma, and professional workflow gravity.

Archis should assume Autodesk can reproduce generic AI features.

A defensible wedge would need to come from a better revision interaction, better project continuity, a trusted open semantic layer, proprietary decision/evaluation data earned through use, or interoperability that users prefer.

## Academic pressure

Recent research increasingly covers:

- floor-plan tokenization,
- multimodal plan understanding,
- generation,
- editing,
- constraint conditioning,
- human guidance,
- structured reconstruction.

Therefore the model itself will likely commoditize.

Archis should behave as if “a model that edits floor plans” will not remain a moat.

## The potential Archis wedge

### 1. Canonical semantic + versioned state

A building is not a pile of generated artifacts. 2D, 3D, constraints, intent, revisions, and exports should refer to one evolving project state.

### 2. Reviewable patches

AI should propose bounded transformations whose geometry and consequences can be inspected, applied, edited, rejected, and reverted.

This is different from replacing the current design with a fresh generated answer.

### 3. Architect-correctable intent graph

Intent should be explicit enough to inspect and change, even when its first draft is inferred.

### 4. Provenance

The system should preserve why a relationship exists or where it came from:

- architect explicit,
- imported constraint,
- inferred hypothesis,
- learned project preference,
- code/analysis result.

### 5. Uncertainty as behavior

The system should ask when confidence is low rather than silently flattening ambiguity.

### 6. Revision memory

The project should accumulate accepted/rejected trade-offs and make later revisions more context-aware.

### 7. Interoperability

Archis should be useful around existing workflows before demanding replacement.

## What Archis should not become

- “Autodesk but smaller,”
- another prompt-to-floor-plan site,
- a rendering showcase,
- a chatbot strapped onto CAD,
- a giant BIM clone,
- a library of random AI features,
- a product whose moat is only proprietary prompts.

## Competitive kill test

Reconsider the wedge if a current product can repeatedly demonstrate all of the following on real architect-authored projects:

1. imports or continues the architect's own project state,
2. preserves a canonical semantic model across representations,
3. identifies likely project-specific relationships without requiring all rules upfront,
4. exposes uncertainty/provenance,
5. lets the architect edit/protect those relationships,
6. accepts a requested change,
7. proposes local reviewable alternatives instead of unrelated regeneration,
8. explains semantic consequences,
9. records accepted/rejected trade-offs as project memory,
10. hands the result back into professional workflows with low friction.

If that workflow is already solved well, a prettier interface is not enough.

## Defensibility hypothesis

Potential long-term advantages, if earned:

- project intent + revision-decision dataset,
- benchmark for design continuity under change,
- reliable local transformation engine,
- open/portable semantic state,
- professional interoperability,
- trusted patch/provenance UX,
- accumulated project memory.

None of these should be described as an existing moat today.

## Market stance

Archis does not need to win by replacing every architecture tool.

A plausible first position is:

```text
existing concept / draft
        ↓
Archis: semantic continuation + revision reasoning
        ↓
reviewed / accepted change
        ↓
existing CAD/BIM/documentation workflow
```

If the product eventually becomes the primary authoring environment, that should happen because users pull it there, not because the roadmap assumes they will abandon their stack.
