# Archis Research Thesis

**Status:** working research direction, September 2026  
**Scope:** early architectural design iteration  
**Claim discipline:** this document separates established capabilities in the market from hypotheses Archis still needs to prove.

## Thesis

The crowded problem is **generating architecture**.

The narrower problem Archis wants to investigate is **changing architecture without unnecessarily erasing the architect's existing decisions**.

> Given an architect-authored design and a new requirement, can a system infer which properties of the design are likely intentional, represent their importance and uncertainty, ask the architect to correct those assumptions, and generate minimal-change alternatives that preserve the confirmed intent?

This is not a claim that design intent has never been represented computationally. Constraint-based design, parametric design, plan libraries, preference systems, interactive generation and architect-in-the-loop workflows all predate Archis. The proposed contribution is the combination of **inference from an existing authored draft + explicit uncertainty + architect correction + minimal-change transformation + semantic impact explanation**.

## Why the broad idea is not novel

A credible Archis thesis has to begin by conceding what the market already does.

### BIM / connected building models

Model-centric BIM tools already represent walls, rooms, doors, windows and other building elements semantically and coordinate multiple views. Therefore “one building behind 2D and 3D” is useful architecture for Archis, but not its research novelty.

### AI-native connected design

Snaptrude describes a connected cloud-native model in which program data, design, details and documentation remain editable, and its 2026 AI workflows cover site analysis, programming, massing, generation and refinement. Its stated direction is architect-controlled AI collaboration.

### Generative schematic exploration

Autodesk Forma's 2026 Building Layout Explorer generates and evaluates floor-plan options from massing and project context. Forma Building Design also links schematic floor-plan edits across plan, elevation and perspective and carries designs toward Revit.

### Firm knowledge and constraints

Finch explicitly lets firms encode design systems, plan libraries, accessibility rules, local code and constraints, then uses those as the basis for layout generation and adaptation. Its own product language includes “your design intent, encoded.”

### Floor-plan understanding + editing research

HouseMind (CVPR 2026) unifies architectural floor-plan understanding, generation and editing using room-instance tokens and symbolic reasoning. This is direct evidence that “AI can understand and edit a floor plan” is no longer a defensible novelty claim by itself.

## The unresolved wedge

Existing systems are increasingly good at answering:

- What spaces are required?
- What constraints must be satisfied?
- What layouts are feasible?
- What options optimize a metric?
- How can this plan be edited?

Archis asks a different question:

> **Of all the facts visible in this particular draft, which ones represent choices the architect cares about preserving?**

A plan contains many observable facts but not all facts have equal design significance.

```text
Observable fact                     Possible interpretation
────────────────────────────────────────────────────────────
Courtyard touches living            deliberate social anchor
Bedrooms cluster at rear            deliberate privacy zoning
Bathroom is 2.1 m from corridor     possibly incidental
Entry narrows before living         possibly deliberate sequence
Wall is exactly 3.82 m long         probably incidental geometry
```

The system should not collapse “possible interpretation” into fact. It needs uncertainty and architect correction.

## Proposed intent representation

A first baseline could classify candidate relationships into four levels:

```text
INVARIANT       must survive unless architect explicitly releases it
STRONG          preserve unless the new requirement forces a trade-off
WEAK            prefer, but sacrifice when useful
FREE            no evidence that this property needs protection
```

Each inferred item should also carry:

```text
IntentHypothesis
├── semantic relationship
├── priority
├── confidence
├── evidence
├── source: inferred | explicit | learned
└── architect status: unreviewed | confirmed | rejected | edited
```

This representation is deliberately interpretable. A black-box “architect style embedding” may become useful later, but it should not be the first proof.

## Research problem 1: latent intent inference

### Question
Can a system predict which spatial/semantic relationships an architect will mark as important from the authored plan plus available project context?

### Baselines

1. geometry-only heuristics
2. topology / adjacency heuristics
3. explicit project brief only
4. multimodal model over plan + brief
5. multimodal model + interaction history

### Ground truth
Ask the architect who authored the plan to annotate which relationships were deliberate, their strength, and whether they may change.

### Metrics

- precision / recall for protected relationships
- ranking agreement for importance
- calibration error for confidence
- inter-rater / author consistency where multiple architects review the same plan

A high raw accuracy with poor calibration is not sufficient. Archis must know when to ask.

## Research problem 2: semantic design distance

The phrase “smallest change” is meaningless until distance is defined.

A geometric distance alone is inadequate. Two plans may move many coordinates while preserving the concept, or move one wall and destroy a crucial spatial relationship.

A starting objective:

```text
Distance(D, D') =
    α · geometric deviation
  + β · topological deviation
  + γ · confirmed-intent loss
  + δ · circulation / experiential deviation
```

The research question is whether a learned or architect-confirmed semantic distance predicts architect judgments better than geometry-only distance.

## Research problem 3: minimal-change transformation

Given:

- authored design D
- new requirement R
- hard constraints H
- confirmed intent I

find candidate D' such that:

```text
R(D') is satisfied
H(D') is satisfied
IntentLoss(D, D') is minimized
UnnecessaryChange(D, D') is minimized
```

The system should return a small number of meaningfully different local alternatives, not an option explosion.

## Research problem 4: semantic impact analysis

An edit has a dependency chain.

```text
wall move
→ room area
→ adjacency
→ circulation
→ opening placement
→ sightline
→ daylight / privacy relationship
→ design intent
```

The system should distinguish:

- direct geometric effects
- deterministic semantic effects
- analysis-derived effects
- uncertain interpretive effects

Explanations should preserve that distinction rather than presenting every inference as certain.

## Research problem 5: learning from architect corrections

A rejected proposal is not enough. The useful signal is *why* it was rejected.

Over a project, corrections could build a project-specific preference model:

```text
privacy > floor-area efficiency
courtyard relationship > shortest circulation
southern openings strongly protected
service-space geometry comparatively flexible
```

This should remain inspectable and editable by the architect.

## Falsifiable experiments

### Experiment A: Can Archis infer intent at all?

Collect 20–50 architect-authored early residential plans with permission. Ask authors to annotate 10–20 candidate relationships per plan. Hide annotations from the model. Compare model/heuristic rankings against author labels.

**Kill signal:** predictions are barely better than simple adjacency/topology heuristics, or architects cannot consistently identify their own invariants.

### Experiment B: Does intent-aware editing beat constraint-only editing?

For each plan, introduce a realistic revision such as:

- kitchen +15% area
- add a small workspace
- reduce footprint 8%
- increase bedroom privacy
- preserve a newly locked structural zone

Generate alternatives using:

A. constraint-only optimization  
B. geometry-minimizing optimization  
C. intent-aware minimal-change optimization

Blind-review the alternatives with the author.

Measure:

- confirmed invariants preserved
- architect preference
- amount of manual correction required
- time to acceptable revision

**Kill signal:** intent-aware variants do not materially outperform simpler baselines.

### Experiment C: Is uncertainty useful?

Compare:

A. system silently assumes intent  
B. system asks about every candidate relationship  
C. confidence-gated clarification

Measure clarification burden, correction rate and downstream quality.

**Goal:** ask fewer, better questions.

## Initial product wedge

**User:** architect / small architecture studio  
**Stage:** early residential or small-building concept iteration  
**Trigger:** a first design already exists and a requirement changes  
**Job:** revise without rebuilding or accidentally flattening the concept

The wedge is intentionally smaller than “replace the architecture stack.”

### MVP interaction

1. open/import one simple authored plan
2. Archis reconstructs semantic rooms / walls / relationships
3. architect sees 5–10 intent hypotheses
4. architect confirms / rejects / changes priority
5. architect requests one revision
6. Archis returns at most three local alternatives
7. each alternative states:
   - what changed
   - what hard constraints remain valid
   - what confirmed intent was preserved
   - what trade-off was introduced
8. architect edits or rejects

## What not to build yet

- autonomous brief → complete building generation
- photorealistic rendering pipeline
- full Revit replacement
- MEP
- structural engineering
- universal code compliance
- huge object library
- collaboration suite
- digital twins
- construction documentation
- “AI architect” chatbot

Those can consume years without testing the thesis.

## Adoption hypothesis

Archis should not initially require a studio to abandon its existing professional stack.

A more plausible path is:

```text
existing authored concept
        ↓
Archis iteration / intent layer
        ↓
approved revision
        ↓
existing BIM / documentation workflow
```

If the core interaction proves valuable, deeper interoperability becomes justified. If not, building IFC and enterprise collaboration first would simply make a larger failed product.

## Competitive pressure

### Snaptrude

**Threat:** very high. It already combines connected models, BIM, architect-controlled AI and increasingly broad early-design agents. It can plausibly move toward richer design-context preservation.

**Archis must prove:** that first-draft intent inference and minimal-change revision is a distinct workflow users value, not wording around capabilities Snaptrude already provides.

### Finch

**Threat:** very high to the “intent + constraints” story. Finch already encodes firm knowledge, plan libraries, accessibility rules and constraints.

**Archis must prove:** value in extracting and negotiating intent from a *specific authored draft*, including uncertainty, rather than primarily applying a predefined firm design system / plan library.

### Autodesk Forma + Revit

**Threat:** platform and distribution. Autodesk can connect schematic generation, analysis and detailed BIM across a massive installed workflow.

**Archis must prove:** a sufficiently sharp interaction or research capability that is useful before becoming a feature incumbents can reproduce.

### Academic floor-plan models

**Threat:** underlying generation/editing models will commoditize.

**Archis implication:** the moat cannot simply be “we have an AI model that edits plans.” The valuable layer would need to become architect-confirmed intent data, interaction history, evaluation methodology, and workflow integration.

## Defensibility hypothesis

Potential defensibility, if earned:

1. **Intent dataset**: authored plan → author-confirmed invariants/preferences → revisions.
2. **Evaluation benchmark**: measuring intent preservation under architectural change.
3. **Preference history**: project-specific corrections and trade-off decisions.
4. **Semantic transformation engine**: deterministic + learned local edits over a structured model.
5. **Trust UX**: calibrated uncertainty and explicit explanations that architects actually accept.

None of these is a moat today.

## What would make me stop building Archis?

Archis should be killed or radically changed if repeated testing shows any of the following:

- architects do not care about preserving inferred intent because existing workflows already make revisions easy enough;
- authors cannot consistently label what they intended, making a reliable target impossible;
- simple rules capture nearly all useful intent;
- architects prefer direct manual editing over reviewing alternatives;
- the clarification burden outweighs saved revision time;
- existing products solve the same job sufficiently well;
- interoperability cost dominates the value of the intent layer;
- users like the demo but will not bring a second real project.

## Current prototype vs research thesis

### Implemented now

- shared semantic room model
- 2D representation
- linked 3D representation
- deterministic hard constraints
- deterministic variants
- semantic explanation/status UI

### Not implemented / not proven

- arbitrary plan parsing
- latent intent inference
- confidence calibration
- architect-confirmed intent graph
- semantic design distance
- learned preference model
- intent-aware optimization
- real-practice time savings
- willingness to pay

This distinction should remain visible in every pitch.

## Sources / current market context

Primary sources and recent research used to keep the thesis honest:

1. Snaptrude, **Announcing Snaptrude AI — an AI that designs with you**, updated June 2026: https://www.snaptrude.com/blog/announcing-snaptrude-ai
2. Snaptrude, **AI Agents in Snaptrude**, March 2026: https://help.snaptrude.com/en/articles/14004374-ai-agents-in-snaptrude
3. Snaptrude, **AI-Powered Design Workflows**: https://help.snaptrude.com/en/articles/12555467-ai-powered-design-workflows
4. Finch, **Product — Your design intent, encoded**: https://www.finch3d.com/product
5. Autodesk, **Building Layout Explorer in Forma Site Design**, June 2026: https://adsknews.autodesk.com/en/news/building-layout-explorer-in-autodesk-forma/
6. Autodesk, **Introduction to Forma Building Design**, April 2026: https://blogs.autodesk.com/forma/2026/04/07/introduction-to-forma-building-design/
7. Qin, Weber & Lu, **Tokenization Allows Multimodal Large Language Models to Understand, Generate and Edit Architectural Floor Plans**, CVPR 2026: https://openaccess.thecvf.com/content/CVPR2026/html/Qin_Tokenization_Allows_Multimodal_Large_Language_Models_to_Understand_Generate_and_CVPR_2026_paper.html

## One-line research question

> **Can a machine infer what an architect meant to preserve, know when it is unsure, and make the smallest useful change without turning the architect's design into its own?**
