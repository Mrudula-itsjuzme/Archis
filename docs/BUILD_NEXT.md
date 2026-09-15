# Build Next

The README is no longer the bottleneck. The demo is.

## P0 — complete the pitch loop

- add one change-request control: `Give the kitchen ~3 m² more area`
- generate 3 local deterministic candidates, not unrelated layouts
- score each with hard constraints + semantic design distance
- show `what changed / what survived / what weakened`
- preview candidate in both 2D and 3D before applying
- let architect accept, reject, or manually edit
- write that decision into the change ledger

## P1 — stop using toy proxies

- replace fixed intent confidence with explicit measurable features
- replace center-distance privacy proxy with visibility/access/zoning features
- compute adjacency from shared boundary rather than buffered AABB overlap
- model walls/openings as first-class topology
- remove any random intent evaluation from the store

## P2 — validation instrumentation

- log hypothesis shown / protected / ignored / rewritten
- log candidate scores and architect selection
- log manual correction after candidate selection
- export anonymized study record as JSON

## P3 — only after architect testing

- natural-language change parsing
- learned intent inference
- richer candidate search
- IFC/BIM interoperability

Do not build generic chat, photoreal rendering, a furniture marketplace, or broad `AI designs your building` generation before P0/P1 are convincing.
