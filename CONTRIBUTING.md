# Contributing to Archis

Archis is being developed as a real multi-contributor architecture product with active research inside it. Before making a substantial change, read:

- [README](README.md)
- [Product direction](docs/PRODUCT_DIRECTION.md)
- [Research thesis](docs/research/RESEARCH_THESIS.md)
- [Technical architecture](docs/engineering/TECHNICAL_ARCHITECTURE.md)

## Ground rules

- **Architect stays authoritative.** AI may interpret, propose, rank, and explain. It must not silently decide material design changes.
- **The canonical building state is the source of truth.** Do not create competing 2D/3D geometry states.
- **Keep deterministic logic verifiable.** Geometry, hard constraints, patch application, and validation belong in deterministic/testable code where possible.
- **Separate fact from hypothesis.** Inferred intent, AI extraction, heuristics, and unvalidated metrics must be labeled honestly.
- **Prefer reviewable patches to whole-design replacement.** Changes should be inspectable, editable, rejectable, and eventually reversible/versioned.
- **Preserve provenance.** We should know whether a relationship came from the architect, an import, a rule, analysis, or inference.
- **Small, focused PRs.** One coherent concern per pull request.

## Getting started

Requirements: Node.js 18+ and npm.

```bash
git clone https://github.com/Mrudula-itsjuzme/Archis.git
cd Archis
npm ci
npm run dev
```

The Vite dev server prints the local URL.

## Environment variables

Create a `.env` file in the repository root. Never commit secrets.

| Variable | Purpose |
| --- | --- |
| `VITE_GEMINI_API_KEY` | legacy/client-facing Gemini configuration where still referenced |
| `GEMINI_API_KEY` | server-side key used by Vercel API routes |

AI features may degrade or fail without the required server-side key. Firebase configuration currently lives in `src/lib/firebase.ts`.

## Project layout

```text
api/                    serverless provider adapters
docs/                   product, research, validation, architecture
src/components/2d       2D editing / blueprint interaction
src/components/3d       Three.js / React Three Fiber view
src/components/ui       product UI and inspectors
src/components/layout   application shell
src/engine              deterministic constraints, intent, variants, change logic
src/models              shared domain types
src/store               app orchestration/state
src/utils               geometry/export helpers
src/lib                 provider setup such as Firebase
scripts/patches         historical one-off patch scripts; do not extend
```

The direction is to keep domain/engine code independent from UI and provider-specific infrastructure.

## Development workflow

1. Update `main`.
2. Create a focused branch such as `feat/change-impact-panel` or `fix/door-topology`.
3. Make the smallest coherent change.
4. Run:
   ```bash
   npm ci
   npm run build
   ```
5. Manually exercise the affected workflow.
6. Add tests when introducing or changing deterministic engine behavior.
7. Open a PR against `main`.
8. Respond to review comments; do not merge around unresolved concerns.

CI runs the production build for PRs and `main`.

## Pull requests

A useful PR explains:

- what changed,
- why it belongs in the product direction,
- which domain state it touches,
- whether behavior is deterministic, heuristic, AI-driven, or user-authored,
- how it was verified,
- screenshots/recordings for UI changes,
- known limitations or follow-up work.

For architecture-sensitive changes, use [the engineering review checklist](docs/engineering/REVIEW_CHECKLIST.md).

## Commit messages

Use Conventional Commit-style subjects:

```text
feat: add reviewable wall-move patch
fix: preserve opening topology when moving a wall
docs: update validation protocol
refactor: isolate persistence adapter
chore: update dependency workflow
```

Use `feat`, `fix`, `docs`, `refactor`, `test`, or `chore`.

## Product architecture rules

### Engine vs AI

An LLM may parse “give the kitchen ~3 m² more area” into a structured goal.

It should not directly become the final geometry mutation.

Preferred flow:

```text
language / image
→ structured interpretation
→ deterministic candidate operation
→ geometry + constraint validation
→ impact analysis
→ architect review
```

### Intent

Never write UI or docs copy that says “Archis knows” an inferred design intention.

Use language such as:

- hypothesis,
- likely relationship,
- inferred preference,
- confidence,
- architect-confirmed.

### Versioning

New editing work should be designed so it can eventually be represented as an explicit patch/delta with provenance. Avoid irreversible hidden mutations.

## Please do not

- commit `.env`, API keys, tokens, or private project data,
- commit `node_modules`, `dist`, or `.vite`,
- add new one-off patch scripts,
- put domain logic only inside React components,
- duplicate geometry state between views,
- bypass deterministic checks because an AI response “looks right,”
- make unvalidated market/research claims,
- expand into unrelated AI features because they demo well.

## Research contributions

For interviews, real design/revision data, or experiments, read:

- [Validation plan](docs/research/VALIDATION_PLAN.md)
- [Architect interview guide](docs/research/ARCHITECT_INTERVIEW.md)
- [Research thesis](docs/research/RESEARCH_THESIS.md)

Only use real project material with permission and appropriate anonymization.

## The simplest decision test

Before building a feature, ask:

> Does this improve Archis's ability to carry one architect-authored project state through change, review, and continuation?

If not, it probably does not belong in the core product yet.
