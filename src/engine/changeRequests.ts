import { ChangeImpactReport, SemanticModel, Space } from '../models/types';
import { evaluateAllConstraints } from './constraints';
import { compareDesigns } from './intent';

const MIN_REQUESTED_AREA = 1;
const MAX_REQUESTED_AREA = 10;

export interface CandidateReadiness {
  ready: boolean;
  reason: string;
}

export interface RevisionCandidate {
  id: string;
  name: string;
  summary: string;
  model: SemanticModel;
  impact: ChangeImpactReport;
  affectedEntities: string[];
  whatChanges: string[];
  why: string;
  preservedConstraints: string[];
  confidence: string;
  tradeoff: string;
  provisionalNotes: string[];
  readiness: CandidateReadiness;
}

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const area = (space: Space) => space.width * space.height;
const isFiniteDimension = (space: Space) => [space.x, space.y, space.width, space.height]
  .every(value => Number.isFinite(value)) && space.width > 0 && space.height > 0;

function updateActiveSpace(
  model: SemanticModel,
  spaceId: string,
  patch: Partial<Pick<Space, 'x' | 'y' | 'width' | 'height'>>,
): boolean {
  let foundInActiveLevel = false;
  const update = (space: Space): Space => space.id === spaceId ? { ...space, ...patch } : space;

  model.rooms = model.rooms.map(update);
  model.project.buildings.forEach(building => building.levels.forEach(level => {
    if (level.id === model.activeLevelId) {
      foundInActiveLevel = level.spaces.some(space => space.id === spaceId);
      level.spaces = level.spaces.map(update);
    }
  }));
  return foundInActiveLevel;
}

function hasLinkedGeometry(model: SemanticModel): boolean {
  return Boolean(
    model.vertices?.length || model.walls?.length || model.openings?.length ||
    model.rooms.some(space => space.wallIds?.length || space.vertices?.length),
  );
}

function getConstraintSummary(base: SemanticModel, candidate: SemanticModel) {
  const baseChecks = evaluateAllConstraints(base);
  const candidateChecks = evaluateAllConstraints(candidate);
  const baseViolations = baseChecks.filter(check => check.result.isViolated);
  const candidateViolations = candidateChecks.filter(check => check.result.isViolated);
  const preservedConstraints = candidateChecks
    .filter((check, index) => !check.result.isViolated && !baseChecks[index]?.result.isViolated)
    .map(check => check.constraint.description);

  return { baseViolations, candidateViolations, preservedConstraints };
}

function getReadiness(
  base: SemanticModel,
  candidate: SemanticModel,
  target: Space,
  isSyncedToActiveLevel: boolean,
): { readiness: CandidateReadiness; preservedConstraints: string[] } {
  const constraintSummary = getConstraintSummary(base, candidate);

  if (!isFiniteDimension(target)) {
    return { readiness: { ready: false, reason: 'The selected space has incomplete rectangular dimensions.' }, preservedConstraints: [] };
  }
  if (target.isLocked) {
    return { readiness: { ready: false, reason: 'The selected space is locked and cannot be changed by this request.' }, preservedConstraints: [] };
  }
  if (!isSyncedToActiveLevel) {
    return { readiness: { ready: false, reason: 'The selected space is not present on the active level, so a local patch cannot be made safely.' }, preservedConstraints: [] };
  }
  if (hasLinkedGeometry(base)) {
    return {
      readiness: { ready: false, reason: 'This proposal changes rectangle fields only; linked walls, vertices, or openings would need an explicit authored update first.' },
      preservedConstraints: constraintSummary.preservedConstraints,
    };
  }
  if (constraintSummary.baseViolations.length) {
    return {
      readiness: { ready: false, reason: 'The authored draft already has a current hard-rule conflict. Resolve it before applying a candidate.' },
      preservedConstraints: constraintSummary.preservedConstraints,
    };
  }
  if (constraintSummary.candidateViolations.length) {
    return {
      readiness: { ready: false, reason: `Current hard-rule screen reports: ${constraintSummary.candidateViolations[0].result.message ?? constraintSummary.candidateViolations[0].constraint.description}` },
      preservedConstraints: constraintSummary.preservedConstraints,
    };
  }
  return {
    readiness: { ready: true, reason: 'Eligible for explicit review and apply; current hard-rule screen has no conflicts.' },
    preservedConstraints: constraintSummary.preservedConstraints,
  };
}

/**
 * Produces three bounded, deterministic rectangular-space options. These are
 * reviewable proposals, not generated floor plans or structural/code checks.
 */
export function generateKitchenExpansionCandidates(
  base: SemanticModel,
  targetExtraArea = 3,
  targetRoomId = 'kitchen',
): RevisionCandidate[] {
  const target = base.rooms.find(room => room.id === targetRoomId);
  if (!target || !Number.isInteger(targetExtraArea) || targetExtraArea < MIN_REQUESTED_AREA || targetExtraArea > MAX_REQUESTED_AREA || !isFiniteDimension(target)) {
    return [];
  }

  const request = `Give ${target.name} ${targetExtraArea} m² more area`;
  const extraWidth = targetExtraArea / target.height;
  const targetArea = area(target) + targetExtraArea;
  const scale = Math.sqrt(targetArea / area(target));
  const options: Array<{
    id: string;
    name: string;
    summary: string;
    patch: Partial<Pick<Space, 'x' | 'y' | 'width' | 'height'>>;
    whatChanges: string[];
    why: string;
    tradeoff: string;
  }> = [
    {
      id: 'east-widen',
      name: 'Widen from the right edge',
      summary: 'Adds the requested area by extending one edge of the selected space.',
      patch: { width: target.width + extraWidth },
      whatChanges: [`Width ${target.width.toFixed(2)} → ${(target.width + extraWidth).toFixed(2)} m`, `Area ${area(target).toFixed(2)} → ${targetArea.toFixed(2)} m²`],
      why: 'This is the smallest single-dimension rectangle edit that meets the requested area.',
      tradeoff: 'The right edge moves outward; nearby space and wall relationships need architect review.',
    },
    {
      id: 'balanced-scale',
      name: 'Balance width and depth',
      summary: 'Distributes the requested area across both dimensions from the current top-left corner.',
      patch: { width: target.width * scale, height: target.height * scale },
      whatChanges: [`Width ${target.width.toFixed(2)} → ${(target.width * scale).toFixed(2)} m`, `Depth ${target.height.toFixed(2)} → ${(target.height * scale).toFixed(2)} m`, `Area ${area(target).toFixed(2)} → ${targetArea.toFixed(2)} m²`],
      why: 'Scaling both dimensions reduces aspect-ratio distortion compared with widening one side.',
      tradeoff: 'Both the right and lower edges move, affecting more adjacent territory than a one-edge edit.',
    },
    {
      id: 'centered-widen',
      name: 'Widen about the center',
      summary: 'Adds the requested area while keeping the selected space center approximately fixed.',
      patch: { x: target.x - extraWidth / 2, width: target.width + extraWidth },
      whatChanges: [`Left edge ${target.x.toFixed(2)} → ${(target.x - extraWidth / 2).toFixed(2)} m`, `Width ${target.width.toFixed(2)} → ${(target.width + extraWidth).toFixed(2)} m`, `Area ${area(target).toFixed(2)} → ${targetArea.toFixed(2)} m²`],
      why: 'Keeping the center approximately fixed may better preserve the authored placement.',
      tradeoff: 'Both side edges move, so it has two neighboring boundary changes to review.',
    },
  ];

  return options.map(option => {
    const model = clone(base);
    const isSyncedToActiveLevel = updateActiveSpace(model, target.id, option.patch);
    const impact = compareDesigns(base, model, request);
    const { readiness, preservedConstraints } = getReadiness(base, model, target, isSyncedToActiveLevel);
    return {
      id: `area-${target.id}-${targetExtraArea}-${option.id}`,
      name: option.name,
      summary: option.summary,
      model,
      impact,
      affectedEntities: [`${target.name} (${target.id})`],
      whatChanges: option.whatChanges,
      why: option.why,
      preservedConstraints,
      confidence: 'Deterministic rectangle arithmetic only; not an architectural suitability score.',
      tradeoff: option.tradeoff,
      provisionalNotes: [
        'Area is a rectangular-space calculation; wall thicknesses, openings, furniture, and clearances are excluded.',
        'This does not establish structural feasibility, building-code compliance, or construction readiness.',
      ],
      readiness,
    };
  }).sort((left, right) => left.impact.distance.total - right.impact.distance.total);
}
