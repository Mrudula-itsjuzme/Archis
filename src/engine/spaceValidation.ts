import { Space } from '../models/types';

export interface SpaceOverlap {
  width: number;
  height: number;
  area: number;
}

export type DimensionName = 'width' | 'height';

/**
 * A rectangle is valid for geometric comparison only when both of its
 * dimensions are finite and greater than zero.
 */
export function getInvalidDimensionNames(space: Pick<Space, 'width' | 'height'>): DimensionName[] {
  const invalid: DimensionName[] = [];

  if (!Number.isFinite(space.width) || space.width <= 0) invalid.push('width');
  if (!Number.isFinite(space.height) || space.height <= 0) invalid.push('height');

  return invalid;
}

export function hasInvalidDimensions(space: Pick<Space, 'width' | 'height'>): boolean {
  return getInvalidDimensionNames(space).length > 0;
}

/**
 * Returns the positive intersection dimensions and area for two rectangular
 * spaces. Touching edges have zero overlap.
 */
export function getSpaceOverlap(
  first: Pick<Space, 'x' | 'y' | 'width' | 'height'>,
  second: Pick<Space, 'x' | 'y' | 'width' | 'height'>,
): SpaceOverlap {
  if (hasInvalidDimensions(first) || hasInvalidDimensions(second)) {
    return { width: 0, height: 0, area: 0 };
  }

  const width = Math.max(
    0,
    Math.min(first.x + first.width, second.x + second.width) - Math.max(first.x, second.x),
  );
  const height = Math.max(
    0,
    Math.min(first.y + first.height, second.y + second.height) - Math.max(first.y, second.y),
  );

  return { width, height, area: width * height };
}

export function getSpaceArea(space: Pick<Space, 'width' | 'height'>): number {
  return hasInvalidDimensions(space) ? 0 : space.width * space.height;
}

export function hasExplicitMinimumArea(space: Pick<Space, 'minArea'>): space is Pick<Space, 'minArea'> & { minArea: number } {
  return space.minArea !== undefined;
}

export function isSpaceBelowMinimumArea(space: Pick<Space, 'width' | 'height' | 'minArea'>): boolean {
  return hasExplicitMinimumArea(space) && !hasInvalidDimensions(space) && getSpaceArea(space) < space.minArea;
}

/**
 * A locked space may not be moved, resized, removed, or unlocked by a
 * candidate patch. Metadata checks can be added alongside this geometry guard.
 */
export function hasLockedSpaceChanged(before: Space, after?: Space): boolean {
  if (!before.isLocked) return false;
  if (!after) return true;

  return (
    after.isLocked !== true ||
    before.x !== after.x ||
    before.y !== after.y ||
    before.width !== after.width ||
    before.height !== after.height
  );
}

/**
 * Reports locked space IDs in the stable order of the base state, making the
 * result safe to surface in a deterministic patch validation result.
 */
export function getChangedLockedSpaceIds(before: readonly Space[], after: readonly Space[]): string[] {
  const spacesAfter = new Map(after.map(space => [space.id, space]));

  return before
    .filter(space => hasLockedSpaceChanged(space, spacesAfter.get(space.id)))
    .map(space => space.id);
}
