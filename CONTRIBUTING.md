# Contributing to Archis

Thanks for helping. Archis is an active research prototype: an architect-authored design goes in, and the software tries to preserve the architect's intent through later changes. Read the [README](README.md) and [`docs/RESEARCH_THESIS.md`](docs/RESEARCH_THESIS.md) first so your change fits the thesis.

## Ground rules

- **Architect stays the authority.** Features should surface uncertainty and ask, not silently decide.
- **Keep deterministic logic verifiable.** Geometry, constraints and variants in `src/engine` are deterministic TypeScript. Do not replace them with opaque or random behaviour.
- **Separate fact from hypothesis.** Do not label something as "inferred intent" unless the code really infers it. Docs and UI copy must match what is implemented.
- **Small, focused changes.** One concern per pull request.

## Getting started

Requirements: Node.js 18+ and npm.

```bash
git clone https://github.com/Mrudula-itsjuzme/Archis.git
cd Archis
npm ci
npm run dev
```

The dev server is Vite; it prints the local URL on start.

### Environment variables

Create a `.env` file in the project root. It is git-ignored; never commit secrets.

| Variable | Purpose |
| --- | --- |
| `VITE_GEMINI_API_KEY` | Gemini key used for AI floor-plan extraction and recommendations |
| `GEMINI_API_KEY` | Same key, read server-side by the serverless functions in `api/` |

The app runs without a key, but AI features will not work. Firebase config lives in `src/lib/firebase.ts`.

## Project layout

```text
api/                serverless functions (extract.ts, recommendations.ts) that call Gemini
docs/               thesis, pitch, validation plan, architecture notes
src/components/2d   2D plan workspace (SVG walls, vertices, blueprint overlay)
src/components/3d   Three.js / React Three Fiber viewer
src/components/ui   shared UI pieces
src/components/layout   app shell, header, sidebars
src/engine          constraints, variants, intent, change requests
src/models          shared types (types.ts)
src/store           Zustand store, initial data, Gemini client
src/utils           geometry graph, SVG export
src/lib             Firebase setup
```

The shared semantic model in the store is the single source of truth. 2D and 3D views read from it; they must not hold competing copies of geometry.

## Development workflow

1. Sync `main`: `git pull origin main`.
2. Branch from it: `git checkout -b feat/short-description`.
3. Make your change.
4. Verify before pushing:
   ```bash
   npm run build
   ```
   `build` runs `tsc` then `vite build`. It must pass with no type errors. There is no test or lint script yet; if you add logic to `src/engine`, please include tests or at least a clear manual verification note in the PR.
5. Manually exercise the affected flow in `npm run dev` (2D edit, 3D view, constraint messages, variants, export as relevant).
6. Open a pull request against `main`.

## Commit messages

Follow the existing [Conventional Commits](https://www.conventionalcommits.org/) style seen in the history:

```text
feat(phase4): render walls as SVG lines with thickness and vertices
fix: make constraints engine dynamic and remove hardcoded residential rules
docs: add architect interview guide
chore: add firebase dependency
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`. Optional scope in parentheses. Imperative, lowercase subject, no trailing period.

## Pull requests

Include:

- What changed and why.
- How you verified it (build output, manual steps, screenshots or a short clip for UI changes).
- Any behaviour that is still mocked, random or unimplemented. Be explicit.

Use [`docs/REVIEW_CHECKLIST.md`](docs/REVIEW_CHECKLIST.md) as a pre-merge guide for larger changes, especially anything touching intent, change requests or candidate previews.

## Code style

- TypeScript with strict types; avoid `any`. Put shared types in `src/models/types.ts`.
- React function components and hooks; state through the Zustand store.
- Tailwind for styling; use `clsx` / `tailwind-merge` for conditional classes.
- Match the surrounding code's naming, comment density and formatting.
- Keep engine code free of UI and store imports so it stays testable.

## Please do not

- Commit `.env`, API keys or Firebase secrets.
- Commit one-off patch scripts (`patch_*.cjs`, `fix_*.cjs`). Make the edit in source directly.
- Commit `node_modules`, `dist` or `.vite` output.
- Make unvalidated claims about market fit or architect demand in docs.

## Reporting issues and ideas

Open a GitHub issue with:

- What you expected vs. what happened.
- Steps to reproduce, plus browser and OS.
- Console errors if any.

For research contributions such as real first-draft → revision pairs, annotation of deliberate vs. incidental relationships or architect interviews, see [`docs/VALIDATION_PLAN.md`](docs/VALIDATION_PLAN.md) and [`docs/ARCHITECT_INTERVIEW.md`](docs/ARCHITECT_INTERVIEW.md). Only share real plans with the owner's permission.
