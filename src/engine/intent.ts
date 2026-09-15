import { ChangeImpactReport, IntentHypothesis, SemanticModel, Space } from '../models/types';
import { evaluateAllConstraints } from './constraints';

const area = (s: Space) => s.width * s.height;
const center = (s: Space) => ({ x: s.x + s.width / 2, y: s.y + s.height / 2 });
const distance = (a: Space, b: Space) => {
  const ca = center(a); const cb = center(b);
  return Math.hypot(ca.x - cb.x, ca.y - cb.y);
};

export function inferIntentHypotheses(model: SemanticModel): IntentHypothesis[] {
  const living = model.rooms.find(r => r.id === 'living');
  const kitchen = model.rooms.find(r => r.id === 'kitchen');
  const bedrooms = model.rooms.filter(r => r.type === 'bedroom');
  const circulation = model.rooms.find(r => r.type === 'circulation' || r.type === 'corridor');
  const hypotheses: IntentHypothesis[] = [];

  if (living && kitchen) hypotheses.push({
    id: 'social-adjacency', label: 'Keep the social core connected',
    description: 'Kitchen and living appear intentionally coupled rather than accidentally nearby.',
    kind: 'ADJACENCY', strength: 'STRONG', confidence: 0.92,
    involvedSpaceIds: [living.id, kitchen.id], decision: 'UNREVIEWED',
    rationale: 'The spaces share the public zone and the current hard-constraint model already treats their adjacency as meaningful.'
  });

  if (living && bedrooms.length) hypotheses.push({
    id: 'privacy-zoning', label: 'Protect bedroom privacy',
    description: 'Sleeping spaces appear grouped away from the primary social room.',
    kind: 'ZONING', strength: 'STRONG', confidence: 0.81,
    involvedSpaceIds: [living.id, ...bedrooms.map(b => b.id)], decision: 'UNREVIEWED',
    rationale: 'Bedroom centers form a distinct zone relative to the living space.'
  });

  if (circulation) hypotheses.push({
    id: 'circulation-spine', label: 'Preserve the circulation spine',
    description: 'The circulation space appears to organize access rather than act as leftover area.',
    kind: 'CIRCULATION', strength: 'PREFERENCE', confidence: 0.68,
    involvedSpaceIds: [circulation.id], decision: 'UNREVIEWED',
    rationale: 'A dedicated circulation entity connects the current room organization.'
  });
  return hypotheses;
}

export function withIntentDecision(model: SemanticModel, id: string, decision: 'PROTECT' | 'IGNORE'): SemanticModel {
  return { ...model, intentHypotheses: (model.intentHypotheses ?? inferIntentHypotheses(model)).map(h => h.id === id ? { ...h, decision } : h) };
}

export function compareDesigns(base: SemanticModel, candidate: SemanticModel, request: string): ChangeImpactReport {
  let geometry = 0;
  for (const original of base.rooms) {
    const next = candidate.rooms.find(r => r.id === original.id);
    if (!next) { geometry += 1; continue; }
    geometry += Math.abs(area(next) - area(original)) / Math.max(area(original), 1);
    geometry += Math.hypot(next.x - original.x, next.y - original.y) * 0.05;
  }
  geometry = Math.min(1, geometry / Math.max(base.rooms.length, 1));

  const living0 = base.rooms.find(r => r.id === 'living'); const living1 = candidate.rooms.find(r => r.id === 'living');
  const beds0 = base.rooms.filter(r => r.type === 'bedroom'); const beds1 = candidate.rooms.filter(r => r.type === 'bedroom');
  const privacy0 = living0 && beds0.length ? beds0.reduce((s,b) => s + distance(living0,b),0)/beds0.length : 0;
  const privacy1 = living1 && beds1.length ? beds1.reduce((s,b) => s + distance(living1,b),0)/beds1.length : 0;
  const privacyWeakened = privacy1 + 0.05 < privacy0;

  const evaluations = evaluateAllConstraints(candidate);
  const violations = evaluations.filter(e => e.result.isViolated);
  const protectedIntent = (base.intentHypotheses ?? inferIntentHypotheses(base)).filter(h => h.decision === 'PROTECT');
  const intentPenalty = protectedIntent.some(h => h.id === 'privacy-zoning') && privacyWeakened ? 1 : 0;
  const topology = violations.some(v => v.constraint.id === 'kitchen-living-adj') ? 1 : 0;
  const total = 0.45 * geometry + 0.25 * topology + 0.30 * intentPenalty;

  const impacts: ChangeImpactReport['impacts'] = [
    { category: 'Geometry', severity: 'INFO', message: `Geometric deviation from the authored draft: ${(geometry*100).toFixed(0)}%.` },
    ...violations.map(v => ({ category: 'Constraint' as const, severity: 'CRITICAL' as const, message: v.result.message ?? v.constraint.description })),
  ];
  if (privacyWeakened) impacts.push({ category: 'Intent', severity: protectedIntent.some(h => h.id === 'privacy-zoning') ? 'WARNING' : 'INFO', message: 'This edit pulls the bedroom zone closer to the primary social space.' });
  if (!violations.length) impacts.push({ category: 'Constraint', severity: 'INFO', message: 'All currently implemented hard constraints remain satisfied.' });

  return { request, impacts, distance: { geometry, topology, intent: intentPenalty, total }, hardConstraintsSatisfied: !violations.length, protectedIntentPreserved: protectedIntent.length ? Math.round((1-intentPenalty)*100) : 100 };
}
