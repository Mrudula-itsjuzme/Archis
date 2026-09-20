# Archis — 5-minute pitch

## 0:00–0:40 — me

Hi, I'm Mrudula. I'm a third-year AI student at Amrita. I've bounced between research, product work, motion capture, adversarial ML and building consumer apps, and I think the pattern is basically that I get very curious about systems that look convincing until you stress them a little.

Archis came from something much more ordinary. My dad is an architect, and I kept seeing the same building get translated between sketches, plans, 3D, revisions and different tools. Every change creates another small round of rebuilding and checking.

## 0:40–1:20 — the first version of the idea was too broad

My first thought was: why can't the building itself be one semantic object, with 2D and 3D just being different views of it?

That is useful infrastructure, but it isn't a novel thesis. BIM already has semantic building objects and coordinated views, and newer tools already do generative and constraint-aware design.

The question I care about now starts later.

An architect has already made the first draft. Then the client says: make the kitchen bigger, move the stair, reduce area, add another room.

The difficult part isn't moving a wall. It's changing the building without accidentally deleting the thinking that made the original design make sense.

## 1:20–2:00 — the hypothesis

A first draft contains explicit constraints, but also fuzzy choices. Maybe the courtyard is deliberately the visual center. Maybe bedrooms are intentionally hidden from the entrance. Maybe a wall dimension is completely incidental.

So Archis does not begin by saying, `I understand your design.`

It begins with hypotheses:

`I think the social core is intentionally connected, 92%.`

`I think the bedroom separation matters, 81%.`

`I think this circulation spine may be deliberate, 68%.`

And then the architect can say protect this, ignore this, or correct me.

## 2:00–3:15 — demo

[Open the architect-authored plan.]

This is one semantic model driving the plan and the 3D view.

[Open Intent.]

These are not facts. They're things Archis thinks might matter. I'll protect the social core and bedroom privacy.

Now imagine the client wants roughly three extra square metres in the kitchen.

The eventual goal is not `generate me another house`. Archis should search nearby changes to this house and compare how much they disturb the original.

A candidate can satisfy every hard constraint and still be a bad revision. So the impact layer looks at geometry, relationships, constraints and the intent the architect explicitly protected.

Instead of only saying `wall moved`, I want it to say something closer to: `This option gives the kitchen the required area and remains valid, but it narrows circulation and weakens the separation you asked me to protect.`

The architect still decides whether that trade-off is worth it.

## 3:15–4:05 — what exists versus what doesn't

The prototype currently has the shared semantic model, linked 2D and 3D, deterministic constraints, variants, an intent-hypothesis model, architect confirmation and semantic impact scoring.

The important caveat is that the intent inference is heuristic right now. I am not claiming I've solved architectural intent. The next step is actually to test whether architects agree with these hypotheses often enough for this interaction to be useful.

That test matters more to me than adding another AI feature.

## 4:05–4:40 — why this could become a company

I also don't think the first version needs to ask architects to throw away Revit or whatever they already use. Archis can initially sit around the messy early-revision layer: bring in a draft, reason about a requested change, approve the revision, hand it back to the professional workflow.

If architects tell me they want this as an integration instead of another authoring tool, then it should be an integration.

The potential moat isn't `we use AI`. It would have to be earned from real architect-confirmed intent, real revisions, and learning which changes professionals accept or reject.

## 4:40–5:00 — close

So the research question I'm testing is pretty specific:

**Can software infer enough from an architect's own draft to help that design survive change without flattening the thinking that created it?**

The architect gives Archis the idea. Archis is supposed to get very good at knowing what not to casually destroy.
