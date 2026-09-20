# Archis Docs

Archis is now being developed as a **real architect-first product**, with research embedded inside the product rather than the repository being organized as a research demo.

## Start here

- **[RESEARCH_THESIS.md](research/RESEARCH_THESIS.md)** — the falsifiable research questions behind design continuity, intent, and revision reasoning
- **[VALIDATION_PLAN.md](research/VALIDATION_PLAN.md)** — design-partner interviews, experiments, product-loop pilots, metrics, and kill criteria
- **[COMPETITIVE_LANDSCAPE.md](research/COMPETITIVE_LANDSCAPE.md)** — what existing architecture software already solves and where Archis still needs to earn differentiation
- **[TECHNICAL_ARCHITECTURE.md](engineering/TECHNICAL_ARCHITECTURE.md)** — canonical semantic state, deterministic engine, intent graph, reviewable patches, versioning, AI boundaries

## Product thesis

> **Continue the architect's own partial design as a semantic, versioned, AI-editable building state, then make later changes as small, reviewable patches rather than replacing the design with a new generated answer.**

## Research thesis

> **Can software preserve continuity in an architect's own design by turning uncertain intent into architect-correctable project knowledge and using it to make smaller, explainable revisions?**

## Product rules

1. The architect remains authoritative.
2. The building state, not an AI response, is the source of truth.
3. AI interprets, proposes, ranks, and explains. Deterministic systems validate geometry and hard constraints.
4. Changes should be reviewable, editable, rejectable, and reversible.
5. Inferred intent must show uncertainty and provenance.
6. Current implementation, heuristic scaffolding, and validated claims must never be blurred together.
7. Archis is not a prompt-to-building generator or a Revit clone.

## Current repository reality

The web prototype already contains more than the original docs implied: linked semantic 2D/3D state, geometry graph work, deterministic constraints, intent hypotheses and inspector UI, a constrained change-request explorer, Gemini-backed extraction/recommendations, Firebase auth/persistence, and SVG/GLTF export.

That does **not** mean the research thesis is solved. It means the product loop is concrete enough to validate.
