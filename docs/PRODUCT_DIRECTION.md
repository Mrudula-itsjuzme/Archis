# Archis Product Direction

**Status:** team product direction, September 2026

## What Archis is

Archis is an architect-first design system for continuing and revising an existing design without losing the reasoning embedded in it.

The product should treat an architect's design as a **living semantic project state**, not a picture to regenerate every time something changes.

> **The architect authors the design. Archis helps the design survive change.**

## The wedge

The first useful loop is:

```text
open / import an existing concept
→ obtain one canonical semantic state
→ inspect/correct geometry and semantics
→ attach explicit constraints
→ surface uncertain intent hypotheses
→ request or perform a change
→ receive small reviewable patches
→ inspect consequences
→ accept / edit / reject / revert
→ continue from the accepted version
→ export / handoff
```

## What AI is for

AI may:

- interpret drawings,
- parse requests,
- suggest semantic labels,
- propose intent hypotheses,
- rank alternatives,
- explain trade-offs.

AI should not silently own:

- geometry,
- hard constraints,
- professional compliance,
- destructive mutations,
- project history.

## Why Archis can be a product rather than a research paper

The product value does not depend on solving perfect latent-intent inference.

Even before that research matures, a useful Archis can provide:

- one semantic design state,
- linked representations,
- explicit constraints,
- versioned revisions,
- structured change impact,
- small inspectable patches,
- project memory,
- interoperable import/export.

Intent inference makes that loop more powerful. It is not the only reason the product can exist.

## Product form

The current implementation is a web prototype.

The target professional product should increasingly support:

- installable/offline-first workflows where practical,
- local/private project data,
- strong project versioning,
- deterministic engine behavior,
- professional import/export,
- collaboration without making cloud availability the source of truth.

Do not rewrite the product around a desktop shell prematurely. First isolate engine, persistence, AI, and UI boundaries so the same product model can survive a delivery-platform change.

## Initial user

Start with architects and small studios doing early design and revision work.

Expand building-type scope only when the engine is robust enough. Archis should eventually support more than houses, including apartments, schools, stations, complexes, and other building classes, but the validation loop should stay narrow before the product surface becomes broad.

## Product success

The strongest early evidence is not signups.

It is:

- a real architect brings a real project,
- completes a revision,
- trusts the resulting state enough to continue,
- exports or hands it off,
- and comes back with another revision or project.

## Non-goals

Archis is not trying to be:

- an autonomous architect,
- a rendering-first visualization app,
- a consumer floor-plan generator,
- a giant object marketplace,
- a universal solver for every building discipline,
- a clone of incumbent BIM software,
- a bag of disconnected AI features.

## Team rule

Every feature proposal should answer:

1. Which part of the canonical project state does this operate on?
2. Is the result deterministic, inferred, or user-authored?
3. What is the provenance?
4. Can the architect inspect and override it?
5. What patch/version does it create?
6. How is the impact validated?
7. Does this make the revision loop better, or merely make the demo busier?

If question 7 has a bad answer, do not build it.
