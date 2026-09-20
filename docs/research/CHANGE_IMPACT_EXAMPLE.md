# Change Impact Example

## Architect draft

Protected by architect:

- kitchen + living remain a connected social core
- bedroom zone remains separated from primary social space

## Client request

> Give the kitchen approximately 3 m² more area.

## Candidate output shape

### A · Local widen

**Request:** satisfied approximately

**Geometry:** kitchen width increases; other room geometry unchanged by the transformation itself.

**Constraints:** evaluate bedroom minima, kitchen/living adjacency and overlap after transformation.

**Intent:** report whether protected social adjacency or bedroom separation is weakened.

**Semantic distance:** combine normalized geometric deviation, topology penalty and protected-intent penalty. Current weights are provisional.

## Why this is different from a warning panel

A conventional validation message answers:

> Is something invalid?

The Archis impact report is trying to answer:

> What did this valid or invalid edit do to the architect-authored design, and which protected ideas did it disturb?

A candidate that passes every hard constraint can therefore still rank below another candidate because it creates more semantic disruption.
