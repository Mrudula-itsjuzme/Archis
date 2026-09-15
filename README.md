# Archis

> **A design environment that starts from the architect’s first idea, not from a blank AI prompt.**

Archis is an early-stage architecture software concept built around one simple frustration: a building should not become a pile of disconnected drawings, models, constraints, and revisions.

The architect already has the first idea. They know the site, the client, the restrictions, the priorities, and the feeling they are trying to create. Archis is meant to help them *work around that idea* without repeatedly rebuilding the same building across different representations.

The core thesis is:

> **The building should exist as one semantic object. 2D plans and 3D models should simply be different views of the same thing.**

A wall should know that it is a wall. A room should know its boundaries, area, neighbors, and requirements. A door should know which wall it belongs to. When something changes, the rest of the building should understand what that change affects.

---

## Why Archis exists

Architectural design is not just “generate a floor plan from a prompt.”

An architect begins with much more than a list of rooms:

- a site and its dimensions
- orientation and access
- setbacks and regulations
- a client brief
- room requirements
- adjacency and circulation preferences
- privacy, light, ventilation, and spatial priorities
- budget and material constraints
- things that must not move or change
- and, most importantly, **design intent**

That intent is difficult to reduce to a prompt.

The first sketch or draft already contains part of it.

Archis starts there.

Instead of asking AI to replace the architect, the idea is to let the architect create the first concept and then give them a system that can understand, test, compare, and explore variations around it while preserving what made the concept theirs.

---

## The idea in one flow

```text
Architect's first draft
        +
site + requirements + constraints + intent
        ↓
semantic building model
        ↓
linked 2D and 3D views
        ↓
constraint checking + change propagation
        ↓
nearby design alternatives
        ↓
architect chooses, edits, rejects, or refines
```

The architect remains the author.

Archis is the medium becoming smarter.

---

## What “semantic” means here

A normal drawing primitive might be:

```text
line from (x1, y1) to (x2, y2)
```

Archis instead wants to understand something closer to:

```text
Wall
├── identity
├── position
├── thickness
├── height
├── material
├── adjacent spaces
├── hosted doors/windows
└── constraints
```

Likewise, a room is not just a rectangle.

```text
Room
├── name / type
├── boundary
├── area
├── neighboring spaces
├── openings
├── minimum requirements
├── privacy / access rules
└── design priorities
```

This model becomes the source of truth.

The 2D plan and the 3D representation both read from the same underlying model rather than trying to synchronize two unrelated files.

---

## What happens when something changes?

Suppose an architect moves a wall.

Archis should not only move pixels.

It should understand the operation:

```text
Move wall
   ↓
room boundaries change
   ↓
room areas change
   ↓
adjacencies may change
   ↓
doors/windows may be affected
   ↓
constraints are re-evaluated
   ↓
2D and 3D views update
   ↓
relevant trade-offs are explained
```

This is the part I care about most: **change propagation through a building that understands what its pieces are.**

---

## Architect first, AI second

Archis is **not** intended to be:

> “Describe a house and AI designs everything for you.”

That removes the most interesting part of architecture: the architect’s judgment.

Instead:

1. the architect creates the first concept,
2. Archis turns the design into structured building objects,
3. explicit constraints and priorities are attached to the model,
4. Archis helps explore nearby alternatives,
5. the architect decides what is worth keeping.

AI can eventually help with things such as:

- understanding natural-language design requirements
- explaining why a constraint failed
- suggesting possible changes
- ranking alternatives based on explicit priorities
- helping compare design trade-offs

But geometry, constraints, and validity should not depend on an LLM hallucinating a building into existence.

---

## Example

An architect starts with a residential concept.

### Hard constraints

```text
Bedroom 1 area >= 12 m²
Bedroom 2 area >= 10 m²
Kitchen remains adjacent to living/dining
Front setback >= required value
Locked structural wall cannot move
All rooms remain reachable
```

### Softer intent

```text
Keep bedrooms more private than social spaces
Preserve the courtyard as the visual center
Prefer better daylight in the living room
Avoid unnecessary corridor area
Do not destroy the original spatial organization
```

Archis could then help explore nearby versions such as:

- **Preserve Original** — almost no change, only resolves conflicts
- **More Private** — pushes sleeping spaces farther from public circulation
- **More Compact** — reduces wasted circulation while preserving hard rules

Instead of simply showing a different floor plan, Archis should explain what changed:

```text
Bedroom wing moved inward by 0.8 m.
Kitchen-living adjacency preserved.
All minimum room areas remain valid.
Circulation area reduced by 10.8%.
Bedroom 2 loses 0.5 m² but remains above its minimum.
```

The point is not to produce the “best” house.

There is no single mathematically perfect house.

The point is to let the architect explore trade-offs without losing their original idea.

---

## Current prototype scope

Archis is currently at the **concept / proof-of-concept stage**.

The first prototype is intentionally tiny. The goal is to prove the interaction and representation before attempting a full architecture product.

### Prototype target

- single-floor residential plan
- a small set of rooms
- editable 2D layout
- shared semantic room model
- simple linked 3D representation
- room area and adjacency constraints
- locked objects
- live constraint warnings
- deterministic design variants
- explanations of what changed and what stayed preserved

### Explicitly not part of the first prototype

- full BIM implementation
- photorealistic rendering
- structural engineering
- MEP systems
- complete building-code compliance
- automatic construction documentation
- multiplayer collaboration
- full Revit replacement
- “AI generates an entire building from nothing”

Keeping the first build small is deliberate.

---

## Prototype architecture

```text
┌──────────────────────────────────────┐
│              UI / VIEWS              │
│   2D Editor       3D Viewer          │
└───────────────┬──────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│       CANONICAL BUILDING MODEL       │
│ rooms • walls • doors • relations    │
└───────────────┬──────────────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
┌───────────────┐  ┌──────────────────┐
│ Constraint    │  │ Variant / Change │
│ Engine        │  │ Exploration      │
└───────────────┘  └──────────────────┘
```

The important rule is:

> **2D and 3D do not synchronize directly with each other. They both synchronize with the same building model.**

That prevents each representation from becoming a separate source of truth.

---

## Longer-term architecture

If the core interaction proves useful, Archis could grow into a deeper semantic engine with:

### Geometry Engine
Handles coordinates, room boundaries, walls, openings, surfaces, dimensions, and eventually solids.

### Topology Engine
Understands relationships such as:

- room A adjacent to room B
- door belongs to wall C
- wall D separates indoor and outdoor space
- room E is reachable through corridor F

### Constraint Engine
Maintains:

- hard requirements
- soft preferences
- site restrictions
- room dimensions
- design relationships
- preserved / locked intent

### Change Propagation
Tracks which parts of the building depend on an edited object and recomputes only the affected pieces.

### Design Exploration
Searches nearby alternatives rather than replacing the architect’s concept with unrelated generated layouts.

### Interoperability
Longer term, the model should be able to hand work off to existing architecture/BIM workflows rather than trying to replace an entire professional ecosystem on day one.

---

## What Archis is *not claiming*

Existing BIM and architecture software already supports semantic building objects, coordinated drawings, 2D/3D workflows, and increasingly AI-assisted design.

So the claim is **not**:

- “nobody has connected 2D and 3D before”
- “semantic building objects do not exist”
- “BIM is broken and Archis replaces all of it”

The question I am actually interested in is narrower:

> **Can software start from an architect’s own first concept, preserve enough of its design intent to matter, and help the architect explore better nearby versions without flattening the design into generic optimization?**

That is the hypothesis I want to test.

---

## Why the architect still matters

Archis can know whether a room is too small.

It can know that two spaces are no longer adjacent.

It can know that a hard constraint was violated.

But architectural judgment includes things that are much harder to formalize:

- what a space should feel like
- what deserves emphasis
- which trade-off is acceptable
- how a sequence of spaces should unfold
- which imperfection gives a design character
- what a particular client actually means when they describe the way they want to live

That is why the architect gives the first draft.

The draft is not merely input geometry. It is evidence of intent.

Archis should help the architect **push their idea further**, not erase the reason an architect was there in the first place.

---

## Why I am building this

I am interested in products where software understands more than the surface representation of something.

With Archis, the interesting question is not “can I render a room in 3D?” It is whether a system can understand enough about a building to make editing, iteration, and exploration feel like working with one coherent thing.

This project is also deliberately being built as a hypothesis rather than presented as a finished company.

I do not know yet whether Archis deserves to become one.

The point of the prototype is to find out.

---

## Status

**Stage:** early proof of concept / active prototyping

**Immediate goal:** build a small, stable demo that proves:

1. an architect’s initial layout can be represented semantically,
2. 2D and 3D can read from the same canonical model,
3. constraints can update live as the design changes,
4. nearby variations can preserve explicit parts of the original concept,
5. the system can explain trade-offs instead of silently changing the design.

---

## Roadmap

### Phase 0 — prove the interaction

- semantic room model
- basic 2D editor
- simple 3D linked view
- constraints
- deterministic alternatives
- trade-off explanations

### Phase 1 — prove usefulness with architects

- test real residential briefs
- observe actual design workflows
- measure whether Archis reduces repetitive iteration
- identify which parts of “design intent” architects actually want the software to preserve

### Phase 2 — deepen the engine

- walls, doors, windows as first-class semantic entities
- stronger topology
- richer constraints
- undo/redo as semantic transactions
- better change propagation

### Phase 3 — only if the previous phases earn it

- AI-assisted intent interpretation
- broader alternative search
- interoperability with BIM / IFC workflows
- collaboration and versioning
- professional pilot projects

---

## One sentence

**Archis starts with the architect’s first idea and helps them explore, test, and evolve it as one connected semantic building instead of repeatedly rebuilding the same design across disconnected representations.**

---

## Repository note

This repository currently documents and prototypes an early product hypothesis. Features described in the longer-term sections are **direction**, not claims of completed functionality.

The README will be updated as the prototype becomes real, gets tested, breaks, and hopefully becomes more specific.
