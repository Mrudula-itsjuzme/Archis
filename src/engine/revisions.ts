import type {
  ProjectBranch,
  ProjectRevision,
  RevisionHistory,
  RevisionOperation,
  SemanticModel,
  Space,
  SpaceProperty,
} from '../models/types';

const ROOT_BRANCH_ID = 'architect-draft';

export function createRevisionHistory(): RevisionHistory {
  return {
    schemaVersion: 1,
    activeBranchId: ROOT_BRANCH_ID,
    branches: [{
      id: ROOT_BRANCH_ID,
      name: 'Architect draft',
      baseRevisionId: null,
      revisionIds: [],
    }],
    revisions: [],
  };
}

export function createBranch(
  history: RevisionHistory,
  name: string,
  id: string,
): RevisionHistory {
  const source = getActiveBranch(history);
  const branch: ProjectBranch = {
    id,
    name,
    baseRevisionId: source.revisionIds.at(-1) ?? source.baseRevisionId,
    // A branch is a sequence of patches over the authored baseline, not a model copy.
    revisionIds: [...source.revisionIds],
  };

  return {
    ...history,
    activeBranchId: branch.id,
    branches: [...history.branches, branch],
  };
}

export function appendRevision(history: RevisionHistory, revision: ProjectRevision): RevisionHistory {
  const branch = history.branches.find(candidate => candidate.id === revision.branchId);
  if (!branch) throw new Error(`Cannot append revision to unknown branch ${revision.branchId}.`);

  return {
    ...history,
    revisions: [...history.revisions, revision],
    branches: history.branches.map(candidate => candidate.id === branch.id
      ? { ...candidate, revisionIds: [...candidate.revisionIds, revision.id] }
      : candidate),
  };
}

export function updateRevisionStatus(
  history: RevisionHistory,
  revisionId: string,
  status: ProjectRevision['status'],
): RevisionHistory {
  return {
    ...history,
    revisions: history.revisions.map(revision => revision.id === revisionId
      ? { ...revision, status }
      : revision),
  };
}

export function materializeBranch(
  baseModel: SemanticModel,
  history: RevisionHistory,
  branchId = history.activeBranchId,
): SemanticModel {
  const branch = history.branches.find(candidate => candidate.id === branchId);
  if (!branch) throw new Error(`Cannot materialize unknown branch ${branchId}.`);

  const revisionById = new Map(history.revisions.map(revision => [revision.id, revision]));
  return branch.revisionIds.reduce((model, revisionId) => {
    const revision = revisionById.get(revisionId);
    return revision?.status === 'accepted' ? applyRevision(model, revision) : model;
  }, clone(baseModel));
}

export function applyRevision(model: SemanticModel, revision: Pick<ProjectRevision, 'operations'>): SemanticModel {
  return revision.operations.reduce((next, operation) => applyOperation(next, operation), clone(model));
}

export function createSpacePropertyOperations(
  before: Space,
  after: Partial<Pick<Space, SpaceProperty>>,
): RevisionOperation[] {
  const properties: SpaceProperty[] = ['x', 'y', 'width', 'height', 'name', 'type'];
  return properties.flatMap(property => after[property] === undefined || before[property] === after[property]
    ? []
    : [{
      kind: 'update-space-property' as const,
      spaceId: before.id,
      property,
      before: before[property],
      after: after[property],
    }]);
}

export function getActiveBranch(history: RevisionHistory): ProjectBranch {
  const branch = history.branches.find(candidate => candidate.id === history.activeBranchId);
  if (!branch) throw new Error('Revision history has no active branch.');
  return branch;
}

function applyOperation(model: SemanticModel, operation: RevisionOperation): SemanticModel {
  if (operation.kind !== 'update-space-property') return model;

  const update = (space: Space): Space => space.id === operation.spaceId
    ? { ...space, [operation.property]: operation.after }
    : space;
  const activeLevelWasUpdated = model.project.buildings.some(building => building.levels.some(level =>
    level.id === model.activeLevelId && level.spaces.some(space => space.id === operation.spaceId)));

  if (!activeLevelWasUpdated) throw new Error(`Cannot update unknown space ${operation.spaceId}.`);

  const project = {
    ...model.project,
    buildings: model.project.buildings.map(building => ({
      ...building,
      levels: building.levels.map(level => level.id === model.activeLevelId
        ? { ...level, spaces: level.spaces.map(update) }
        : level),
    })),
  };

  return {
    ...model,
    project,
    rooms: model.rooms.map(update),
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
