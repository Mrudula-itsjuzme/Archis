import { ChangeImpactReport, SemanticModel } from '../models/types';
import { compareDesigns } from './intent';

export interface RevisionCandidate {
  id: string;
  name: string;
  summary: string;
  model: SemanticModel;
  impact: ChangeImpactReport;
}

const clone = (m: SemanticModel): SemanticModel => JSON.parse(JSON.stringify(m));

function syncRoom(model: SemanticModel, roomId: string, patch: Partial<{x:number;y:number;width:number;height:number}>) {
  const apply = (r: any) => r.id === roomId ? { ...r, ...patch } : r;
  model.rooms = model.rooms.map(apply);
  for (const building of model.project.buildings) for (const level of building.levels) {
    if (level.id === model.activeLevelId) level.spaces = level.spaces.map(apply);
  }
}

/**
 * First falsifiable change request for the demo.
 * These are deterministic local transformations, not AI-generated architecture.
 */
export function generateKitchenExpansionCandidates(base: SemanticModel, targetExtraArea = 3): RevisionCandidate[] {
  const kitchen = base.rooms.find(r => r.id === 'kitchen');
  if (!kitchen) return [];
  const request = `Give the kitchen about ${targetExtraArea} m² more area`;
  const candidates: Omit<RevisionCandidate, 'impact'>[] = [];

  // A: widen kitchen with the smallest single-entity dimensional change.
  const a = clone(base);
  const extraWidth = targetExtraArea / Math.max(kitchen.height, 0.1);
  syncRoom(a, kitchen.id, { width: kitchen.width + extraWidth });
  candidates.push({ id: 'kitchen-a', name: 'Local widen', summary: 'Adds area by changing one kitchen dimension only.', model: a });

  // B: distribute the change across both dimensions to reduce dimensional distortion.
  const b = clone(base);
  const targetArea = kitchen.width * kitchen.height + targetExtraArea;
  const scale = Math.sqrt(targetArea / Math.max(kitchen.width * kitchen.height, 0.1));
  syncRoom(b, kitchen.id, { width: kitchen.width * scale, height: kitchen.height * scale });
  candidates.push({ id: 'kitchen-b', name: 'Balanced expansion', summary: 'Spreads the requested area across kitchen width and depth.', model: b });

  // C: expand while shifting half the added width back, preserving the kitchen center approximately.
  const c = clone(base);
  syncRoom(c, kitchen.id, { x: kitchen.x - extraWidth / 2, width: kitchen.width + extraWidth });
  candidates.push({ id: 'kitchen-c', name: 'Centered expansion', summary: 'Keeps the kitchen center closer to the authored position.', model: c });

  return candidates.map(candidate => ({ ...candidate, impact: compareDesigns(base, candidate.model, request) }))
    .sort((x, y) => x.impact.distance.total - y.impact.distance.total);
}
