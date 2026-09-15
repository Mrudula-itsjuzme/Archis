# Archis Demo Script

Target: 3–4 minutes of product inside a 5-minute pitch. Do not tour the UI. Prove one idea.

## Setup

Open one architect-authored residential draft. 2D plan and 3D view are already linked to the same semantic model.

Say:

> This isn't a prompt asking AI to invent a house. Assume the architect already designed this. The interesting question starts when the client changes something.

## Beat 1: show that Archis has hypotheses, not mind-reading

Open **Intent**.

Show three hypotheses such as:

- kitchen + living form a connected social core, 92%
- bedroom separation appears deliberate, 81%
- circulation spine appears meaningful, 68%

Say:

> These aren't facts. They're Archis saying, 'I think these things might matter. Am I right?'

Protect the first two. Ignore or leave the weaker one unreviewed.

## Beat 2: request a change

Use one concrete request:

> The client wants roughly 3 m² more kitchen area.

Avoid generic `generate alternatives` language.

## Beat 3: compare nearby changes

Show 2–3 alternatives that all try to satisfy the request but disturb the original differently.

Each card should show:

- hard constraints pass/fail
- semantic distance from original
- protected intent preserved
- the most important consequence

Example:

**Option A · 0.18 distance**

Kitchen +2.8 m². Social adjacency preserved. Bedroom privacy unchanged. Living room loses 1.1 m².

**Option B · 0.24 distance**

Kitchen +3.1 m². Hard constraints pass. Circulation narrows. Bedroom zone remains protected.

**Option C · 0.31 distance**

Kitchen +3.4 m². Geometrically valid, but weakens a protected relationship.

## Beat 4: show the consequence, not merely the geometry

Open the impact report.

Say:

> A CAD tool can tell me the wall moved. What I'm testing is whether Archis can tell me what that move did to the design.

Show geometry + constraint + relationship + intent consequences.

## Beat 5: architect stays authoritative

Choose one option, then manually edit it.

Say:

> The architect can accept it, reject it, or change it. That correction is useful because it tells Archis which trade-off actually mattered for this project.

## Close

> The research question isn't whether AI can generate another floor plan. It's whether software can infer enough from an architect's own draft to help it survive change without flattening the thinking that created it.

## If the prototype breaks

Have a 45–60 second screen recording of this exact path. Never attempt an untested arbitrary-plan import during the pitch.

## What not to demo

Do not spend pitch time on furniture catalogs, pretty rendering, login, generic chat, dashboards, arbitrary building types, BIM export, or AI-generated buildings. They dilute the one thing the audience should remember.
