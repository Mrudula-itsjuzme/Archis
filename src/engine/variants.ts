import { SemanticModel, Space, VariantStats } from '../models/types';
import { CandidateReadiness } from './changeRequests';
import { evaluateAllConstraints } from './constraints';

export interface ExplainableVariant {
  model: SemanticModel;
  stats: VariantStats;
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
const isCirculation = (space: Space) => space.type === 'circulation' || space.type === 'corridor';

function updateActiveSpaces(
  model: SemanticModel,
  patches: Map<string, Partial<Pick<Space, 'x' | 'y' | 'width' | 'height'>>>,
): boolean {
  const update = (space: Space): Space => patches.has(space.id) ? { ...space, ...patches.get(space.id) } : space;
  model.rooms = model.rooms.map(update);
  let activeLevelFound = false;
  model.project.buildings.forEach(building => building.levels.forEach(level => {
    if (level.id === model.activeLevelId) {
      activeLevelFound = true;
      level.spaces = level.spaces.map(update);
    }
  }));
  return activeLevelFound;
}

function hasLinkedGeometry(model: SemanticModel): boolean {
  return Boolean(
    model.vertices?.length || model.walls?.length || model.openings?.length ||
    model.rooms.some(space => space.wallIds?.length || space.vertices?.length),
  );
}

function getStats(before: SemanticModel, after: SemanticModel): VariantStats {
  const total = (model: SemanticModel, predicate: (space: Space) => boolean) => model.rooms
    .filter(predicate)
    .reduce((sum, space) => sum + area(space), 0);
  return {
    circulationAreaChange: total(after, isCirculation) - total(before, isCirculation),
    primaryAreaChange: total(after, space => !isCirculation(space)) - total(before, space => !isCirculation(space)),
    preservedAdjacencies: [],
  };
}

function getReadiness(
  base: SemanticModel,
  candidate: SemanticModel,
  affected: Space[],
  activeLevelFound: boolean,
  isBaseline = false,
): { readiness: CandidateReadiness; preservedConstraints: string[] } {
  if (isBaseline) return {
    readiness: { ready: true, reason: 'This restores the architect-authored baseline; it introduces no candidate geometry change.' },
    preservedConstraints: [],
  };
  if (!affected.length) return {
    readiness: { ready: false, reason: 'No applicable spaces were found for this bounded option.' },
    preservedConstraints: [],
  };
  if (affected.some(space => space.isLocked)) return {
    readiness: { ready: false, reason: 'At least one affected space is locked and cannot be changed by this option.' },
    preservedConstraints: [],
  };
  if (!activeLevelFound || affected.some(space => !base.project.buildings.some(building => building.levels.some(level =>
    level.id === base.activeLevelId && level.spaces.some(activeSpace => activeSpace.id === space.id))))) {
    return {
      readiness: { ready: false, reason: 'An affected space is not present on the active level, so the option cannot be applied as a local patch.' },
      preservedConstraints: [],
    };
  }
  const baseChecks = evaluateAllConstraints(base);
  const candidateChecks = evaluateAllConstraints(candidate);
  const preservedConstraints = candidateChecks
    .filter((check, index) => !check.result.isViolated && !baseChecks[index]?.result.isViolated)
    .map(check => check.constraint.description);
  if (hasLinkedGeometry(base)) return {
    readiness: { ready: false, reason: 'This option changes rectangle fields only; linked walls, vertices, or openings need an explicit authored update first.' },
    preservedConstraints,
  };
  if (baseChecks.some(check => check.result.isViolated)) return {
    readiness: { ready: false, reason: 'The architect draft has a current hard-rule conflict. Resolve it before applying an option.' },
    preservedConstraints,
  };
  const violation = candidateChecks.find(check => check.result.isViolated);
  if (violation) return {
    readiness: { ready: false, reason: `Current hard-rule screen reports: ${violation.result.message ?? violation.constraint.description}` },
    preservedConstraints,
  };
  return {
    readiness: { ready: true, reason: 'Eligible for explicit review and apply; current hard-rule screen has no conflicts.' },
    preservedConstraints,
  };
}

function describeChanges(before: SemanticModel, after: SemanticModel, affected: Space[]): string[] {
  return affected.map(space => {
    const next = after.rooms.find(candidate => candidate.id === space.id)!;
    const changes = [
      next.x !== space.x ? `x ${space.x.toFixed(2)} → ${next.x.toFixed(2)} m` : '',
      next.y !== space.y ? `y ${space.y.toFixed(2)} → ${next.y.toFixed(2)} m` : '',
      next.width !== space.width ? `width ${space.width.toFixed(2)} → ${next.width.toFixed(2)} m` : '',
      next.height !== space.height ? `depth ${space.height.toFixed(2)} → ${next.height.toFixed(2)} m` : '',
    ].filter(Boolean).join(', ');
    return `${space.name}: ${changes}.`;
  });
}

function buildVariant(
  base: SemanticModel,
  patches: Map<string, Partial<Pick<Space, 'x' | 'y' | 'width' | 'height'>>>,
  why: string,
  tradeoff: string,
): ExplainableVariant {
  const model = clone(base);
  const affected = base.rooms.filter(space => patches.has(space.id));
  const activeLevelFound = updateActiveSpaces(model, patches);
  const { readiness, preservedConstraints } = getReadiness(base, model, affected, activeLevelFound);
  return {
    model,
    stats: getStats(base, model),
    affectedEntities: affected.map(space => `${space.name} (${space.id})`),
    whatChanges: describeChanges(base, model, affected),
    why,
    preservedConstraints,
    confidence: 'Deterministic rectangle arithmetic only; not an architectural suitability score.',
    tradeoff,
    provisionalNotes: [
      'Reported area deltas are rectangular-space estimates; wall thicknesses, openings, furniture, and clearances are excluded.',
      'This does not establish structural feasibility, building-code compliance, or construction readiness.',
    ],
    readiness,
  };
}

export function generatePreserveVariant(baseModel: SemanticModel): ExplainableVariant {
  const model = clone(baseModel);
  const { readiness, preservedConstraints } = getReadiness(baseModel, model, [], true, true);
  return {
    model,
    stats: { circulationAreaChange: 0, primaryAreaChange: 0, preservedAdjacencies: [] },
    affectedEntities: [],
    whatChanges: ['No geometry change.'],
    why: 'Returns to the architect-authored baseline instead of making automatic adjustments.',
    preservedConstraints,
    confidence: 'Exact baseline copy; no candidate transformation is made.',
    tradeoff: 'Any accepted candidate changes are discarded when returning to this baseline.',
    provisionalNotes: ['No new constraint, structural, or code conclusion is made by restoring the baseline.'],
    readiness,
  };
}

export function generateMorePrivateVariant(baseModel: SemanticModel): ExplainableVariant {
  const patches = new Map<string, Partial<Pick<Space, 'x' | 'y' | 'width' | 'height'>>>();
  baseModel.rooms.filter(space => space.type === 'bedroom' || space.type === 'bathroom')
    .forEach(space => patches.set(space.id, { y: space.y + 2 }));
  baseModel.rooms.filter(isCirculation).forEach(space => patches.set(space.id, { ...patches.get(space.id), height: space.height + 2 }));
  return buildVariant(
    baseModel,
    patches,
    'Moves private rooms 2 m along the positive Y axis and extends existing circulation by 2 m.',
    'This explores greater separation only; moving several spaces may create adjacency, access, or boundary conflicts that need review.',
  );
}

export function generateMoreCompactVariant(baseModel: SemanticModel): ExplainableVariant {
  const patches = new Map<string, Partial<Pick<Space, 'x' | 'y' | 'width' | 'height'>>>();
  baseModel.rooms.forEach(space => {
    if (space.type === 'bedroom') {
      const minimumArea = Math.max(space.minArea ?? 0, 10);
      const scale = Math.sqrt(Math.max(minimumArea, area(space) * 0.9) / area(space));
      patches.set(space.id, { width: space.width * scale, height: space.height * scale });
    } else if (space.type === 'bathroom') {
      patches.set(space.id, { width: Math.max(0.5, space.width * 0.9), height: Math.max(0.5, space.height * 0.9) });
    } else if (isCirculation(space)) {
      patches.set(space.id, { width: Math.max(0.5, space.width - 0.5) });
    }
  });
  return buildVariant(
    baseModel,
    patches,
    'Reduces bedroom and bathroom rectangles by at most 10%, while reducing circulation width by at most 0.5 m.',
    'Compactness trades away room and circulation area; the result is only an option, not a claim that clearances or use requirements are met.',
  );
}
