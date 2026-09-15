# Archis — Pitch Notes

> **The architect authors the design. Archis helps the design survive change.**

This is the pitch version, not the technical specification. It is written to survive the obvious questions rather than make Archis sound larger than it is.

## 30 seconds

My dad is an architect, and one thing that kept bothering me was not simply that architects use a lot of tools. It was what happens after the first design exists. Requirements change constantly, and every change can quietly damage decisions that were never written down as formal constraints.

Archis starts from the architect's own draft. The idea is to understand the building semantically, form hypotheses about what the architect was trying to protect, ask when it is uncertain, and then help explore the smallest changes that satisfy a new requirement without unnecessarily destroying the original design.

I'm not trying to build an AI architect. I'm testing whether software can become better at **preserving human architectural intent through iteration**.

## 90 seconds

Architecture software is already extremely capable. BIM already gives us semantic building objects and linked views. Snaptrude is building an AI-native connected design environment. Finch encodes firm design systems and constraints. Autodesk Forma is generating and evaluating early layouts. So my thesis cannot be “AI + BIM” or “2D and 3D finally talk to each other.” Those problems are already being worked on seriously.

The part I keep coming back to happens **after an architect has made the first meaningful design decision**.

A floor plan contains explicit requirements, like bedroom area or adjacency, but it also contains choices that are harder to type into a form. Maybe the courtyard is deliberately the visual center. Maybe the bedrooms are intentionally hidden from the entrance. Maybe the narrow entry opening into a larger living space is part of the experience. And maybe a particular bathroom wall means absolutely nothing.

When a requirement changes, software can tell us what geometry moved or whether a rule failed. What I want to test is whether it can identify which of those existing relationships probably mattered, show the architect what it thinks, let them correct it, and then search for nearby revisions that preserve the confirmed intent.

The prototype today is much smaller than that vision. It has one semantic model driving 2D and 3D views, deterministic constraints and a few deterministic variants. That proves the interaction scaffold, not the hard research problem.

The next proof is intent inference and minimal-change revision on real architect-authored plans. If that doesn't outperform simple constraint-based editing, the thesis is wrong and I should change it.

## The problem in one example

An architect has already designed a house.

The client says:

> “Can we make the kitchen 15% larger?”

A normal edit may trigger:

```text
kitchen grows
→ dining shrinks
→ circulation moves
→ door shifts
→ entrance sightline changes
→ courtyard relationship weakens
```

Everything may still be geometrically valid.

But the design may be worse **according to the architect's own original priorities**.

Archis should eventually be able to answer:

> “I can make the kitchen larger in three ways. Option A changes the least geometry but weakens the courtyard relationship you marked important. Option B moves more wall length but preserves that relationship. Option C changes the bedroom edge and affects privacy. Which trade-off do you want?”

That is the product.

## Why not just BIM?

Because BIM solves a different foundational problem extremely well: representing and coordinating building information.

Archis uses the same semantic premise. The proposed wedge is **reasoning about what should remain invariant when an already-authored design changes**.

If all Archis does is semantic objects + linked 2D/3D, it should not exist as a company.

## Doesn't Snaptrude already do this?

Snaptrude is the competitor I would take most seriously. It already has a connected editable model, architect-controlled AI, site/program/design workflows, BIM and increasingly sophisticated agents.

So “AI that works with architects” is not my differentiation.

The thing I would test against Snaptrude is narrower: start from a particular architect-authored draft, infer which relationships in *that draft* are deliberate, expose uncertainty, let the architect confirm them, and optimize later revisions around preserving those decisions.

If users tell me Snaptrude already solves that job well enough in practice, that is evidence against Archis, not something I should explain away.

## Doesn't Finch already encode design intent?

Finch is very close to part of the thesis. It lets firms encode plan libraries, design systems, rules, accessibility requirements and constraints, then uses that knowledge to generate and adapt layouts.

The distinction I want to test is between:

**knowledge supplied to the system beforehand**

and

**intent inferred from this specific authored design, negotiated with the architect, and updated from their corrections.**

That distinction is only useful if architects actually value it. It is not automatically a moat.

## Why not make a Revit plugin?

Maybe that is eventually the correct product form.

Right now I do not want integration strategy to decide the research question. The first thing to prove is whether intent-aware minimal-change iteration is useful at all.

If it is, the lowest-friction adoption path may absolutely be a plugin or interoperable layer rather than asking firms to migrate to another full authoring platform.

I would rather discover that from users than defend “standalone platform” as an identity.

## Why does this need AI?

A lot of Archis should **not** need AI.

Geometry, topology, explicit constraints and validity checks should be deterministic and inspectable wherever possible.

AI becomes useful where the information is ambiguous:

- interpreting a sketch or existing plan,
- proposing likely intent relationships,
- understanding a natural-language revision request,
- ranking or explaining trade-offs,
- learning preferences from corrections.

The system should never use “AI” as an excuse to make deterministic building logic unreliable.

## Aren't you replacing architects?

No. The first draft is deliberately architect-authored.

Archis should not decide what the architecture means and silently optimize it. It should say what it thinks matters, expose confidence, and let the architect correct it.

The architect decides what is worth preserving and which trade-off is acceptable. Archis does the computational work around that judgment.

## What is proprietary?

Today, nothing defensible enough to call a moat.

If the thesis works, the valuable assets could become:

- a dataset linking authored plans to author-confirmed intent,
- a benchmark for intent preservation under design changes,
- project-specific correction and preference histories,
- a semantic minimal-change engine,
- an interaction model for calibrated uncertainty and architect correction.

Those have to be earned through real usage.

## Why would anyone migrate?

I would not ask them to migrate first.

The initial adoption hypothesis is an iteration layer around an existing early-design workflow. Bring in a concept, test a revision, take the accepted result back into the firm's normal stack.

Only if architects repeatedly choose the workflow should Archis expand deeper into authoring and interoperability.

## What have you validated?

The current prototype validates **software architecture**, not market demand.

It demonstrates that one semantic state can drive 2D and 3D representations, deterministic constraints and variant transformations.

It does **not** yet validate:

- latent intent inference,
- architectural quality,
- time savings in real practice,
- willingness to pay,
- or repeated architect usage.

Having a practicing architect in my family gives me unusually convenient access to an initial user. It does not count as validation by itself.

## What if architects don't want variants?

Then variants should disappear.

The deeper job is helping an architect understand the consequences of a requested change and preserve what matters. That could manifest as three alternatives, one suggested repair, impact analysis, or simply warnings during direct manual editing.

I care about the job, not defending the button.

## Why now?

Architecture AI is rapidly making **first-option generation cheaper**. Snaptrude, Forma, Finch and research systems are all pushing that direction.

That creates a second-order problem: more generated or rapidly edited options make it more important to maintain project context, constraints and human intent across iterations.

Archis is a bet that the scarce thing will increasingly be not “can software produce another layout?” but **“can it change my layout without forgetting why it looked like this?”**

That is a hypothesis worth testing now precisely because generation is becoming less scarce.

## Why me?

I did not arrive at architecture because I searched for a market with AI in it. My dad practices architecture, so I have been able to see the workflow closely enough for the friction to bother me.

The other reason this problem fits me is that a lot of my previous work has ended up around the same uncomfortable gap: a system can look correct without actually preserving what matters. That happened in research, in motion capture, in adversarial modelling and in products.

I tend to keep pulling at that gap until I understand what is underneath it.

I am also early enough to say what I do not know. I am not an architect, I have not validated willingness to pay, and the current prototype does not solve intent inference. The reason I am building it is to turn those unknowns into experiments rather than pitch around them.

## What I would build next

Not more dashboard. Not photorealistic rendering. Not a giant BIM clone.

I would take real architect-authored plans and revision histories, annotate which relationships the authors actually intended to preserve, and build the smallest experiment that answers:

> Can Archis predict those relationships, know when it is uncertain, and produce revisions architects prefer over constraint-only alternatives?

If yes, deepen it.

If no, kill or mutate the thesis.

## Five-minute pitch structure

**0:00–0:40 — Me**  
Third-year AI student. Research + products + systems. I like problems where something looks correct until you stress it.

**0:40–1:15 — Why architecture**  
Dad is an architect. I kept noticing the cost of iteration after a design already exists.

**1:15–2:15 — Problem**  
Explicit constraints are only part of a draft. The drawing contains latent choices. Requirements change; those choices get accidentally destroyed.

**2:15–3:00 — Archis**  
Semantic model → intent hypotheses → architect confirmation → minimal-change revision → impact explanation.

**3:00–3:35 — Demo**  
Show shared semantic state, 2D/3D, constraint reaction and deterministic variants. Clearly say intent inference is the next experiment.

**3:35–4:20 — Why existing tools don't make the question disappear**  
Acknowledge BIM, Snaptrude, Finch, Forma. State the narrow wedge. Do not fake novelty.

**4:20–5:00 — Why I am building it / why fellowship**  
I want to learn whether this can become a real product, and I want experienced people around me who will tell me when the thesis is wrong before I spend years defending it.

## Closing line

> **I don't think architecture needs another machine that is desperate to have ideas. I think there is room for one that gets better at understanding which of the architect's ideas it should not casually destroy.**

## Evidence / competitor reading

- Snaptrude AI: https://www.snaptrude.com/blog/announcing-snaptrude-ai
- Snaptrude AI workflows: https://help.snaptrude.com/en/articles/12555467-ai-powered-design-workflows
- Finch product: https://www.finch3d.com/product
- Autodesk Forma Building Layout Explorer: https://adsknews.autodesk.com/en/news/building-layout-explorer-in-autodesk-forma/
- Autodesk Forma Building Design: https://blogs.autodesk.com/forma/2026/04/07/introduction-to-forma-building-design/
- HouseMind, CVPR 2026: https://openaccess.thecvf.com/content/CVPR2026/html/Qin_Tokenization_Allows_Multimodal_Large_Language_Models_to_Understand_Generate_and_CVPR_2026_paper.html
