# Competitive Landscape

## The uncomfortable starting point

Archis is not novel because it has semantic building objects, linked 2D/3D views, constraints, or AI-assisted alternatives. Mature BIM and newer design platforms already cover large pieces of that territory.

The thesis must survive without pretending otherwise.

## Categories Archis overlaps

### BIM authoring

Revit and Archicad already treat buildings as coordinated model-centric objects rather than unrelated drawings. Archis should not pitch linked views as the invention.

### Collaborative browser-native design

Snaptrude is particularly close to the broad product story: connected building models, collaborative design and increasingly AI-assisted workflows. A pitch that stops at `semantic model + browser + AI` is not differentiated enough.

### Generative / feasibility design

Autodesk Forma, TestFit and related tools explore alternatives from site, program, performance and feasibility constraints. `Generate multiple valid plans` is therefore not a sufficient wedge.

### Constraint / design-system generation

Finch is close to the technical territory. Its design systems, adaptive plans and encoded intent make it especially important not to claim that Archis invented constraint-aware or intent-aware variation.

### Research systems

Recent floor-plan research increasingly combines understanding, generation, editing and multimodal conditioning. The research question cannot simply be `can AI edit a floor plan?`

## The narrower Archis wedge

Archis begins after an architect has already authored a meaningful first draft.

The bet is:

> infer which properties of that particular draft appear intentional, expose those hypotheses and their uncertainty to the architect, then optimize requested revisions for minimal semantic disruption rather than generate a fresh design.

The unit of value is not `another option`.

It is `a useful change that still feels like my design`.

## Why an architect might care

Real projects accumulate change requests. A client wants a larger kitchen. A setback changes. A bedroom must become accessible. Cost pressure removes area. A stair moves. The painful part is often not making one geometric change, but understanding everything that change quietly damages.

Archis is testing whether a semantic impact layer can make those consequences explicit.

## Why this may belong beside existing tools first

Replacing an established BIM/CAD workflow creates enormous adoption friction before the thesis is even validated.

A more credible first wedge is:

`architect draft → Archis reasoning / constrained revision → approved result → existing professional workflow`

If architects want the capability inside their current environment, integration is a feature of the strategy, not a failure of the idea.

## Potential moat, if earned

There is no moat merely because the current prototype has a semantic model.

A stronger moat could emerge from:

- architect-confirmed intent annotations tied to real drafts
- change requests paired with accepted/rejected revisions
- a benchmark for semantic intent preservation under change
- calibrated models of what is likely deliberate versus incidental
- project-specific preference learning from corrections
- explainable semantic impact analysis

None of those are defensible until Archis has real professional data and evidence.

## Positioning sentence

**Archis is an intent-preserving revision layer for architecture: the architect authors the design, Archis helps it survive change.**

## Questions every pitch should survive

**Isn't this BIM?** BIM coordinates building information. Archis's experiment is about inferring and preserving architect-confirmed intent under change. The underlying semantic model is infrastructure, not the novelty claim.

**Why not Snaptrude / Finch / Forma?** They validate that connected, generative and constraint-aware architectural software matters. Archis is deliberately testing a narrower interaction: start from this architect's authored solution and minimize semantic damage when requirements change.

**Why not a plugin?** It may become one. The research engine should be separable from the authoring shell.

**Why AI?** AI is useful where intent is fuzzy and difficult to encode manually. Deterministic geometry and constraints remain authoritative. The system should ask when uncertain rather than hallucinate certainty.

**What is proprietary today?** Nothing defensible yet. The prototype is an experiment designed to discover whether an intent-preservation engine and the data created through architect correction are worth building into a moat.
