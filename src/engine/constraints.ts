import { Constraint, ConstraintResult, SemanticModel, Space } from '../models/types';
import {
  getInvalidDimensionNames,
  getSpaceArea,
  getSpaceOverlap,
  hasExplicitMinimumArea,
  isSpaceBelowMinimumArea,
} from './spaceValidation';

function formatArea(area: number): string {
  return `${area.toFixed(2)} m²`;
}

function violatedSpaceIds(spaces: Space[]): Pick<ConstraintResult, 'violatingSpaceIds' | 'violatingRoomIds'> {
  const ids = spaces.map(space => space.id);
  return { violatingSpaceIds: ids, violatingRoomIds: ids };
}

function shareRectangleEdge(first?: Space, second?: Space): boolean {
  if (!first || !second) return false;

  const overlap = getSpaceOverlap(first, second);
  if (overlap.area > 0) return true;

  const verticalContact =
    (first.x + first.width === second.x || second.x + second.width === first.x) &&
    Math.min(first.y + first.height, second.y + second.height) > Math.max(first.y, second.y);
  const horizontalContact =
    (first.y + first.height === second.y || second.y + second.height === first.y) &&
    Math.min(first.x + first.width, second.x + second.width) > Math.max(first.x, second.x);

  return verticalContact || horizontalContact;
}

export function getDynamicConstraints(model: SemanticModel): Constraint[] {
  const constraints: Constraint[] = [
    {
      id: 'positive-space-dimensions',
      type: 'HARD',
      description: 'Spaces must have positive finite width and height',
      evaluate: (candidate) => {
        const invalidSpaces = candidate.rooms.filter(space => getInvalidDimensionNames(space).length > 0);
        if (!invalidSpaces.length) return { isViolated: false };

        const first = invalidSpaces[0];
        const invalidDimensions = getInvalidDimensionNames(first).join(' and ');
        return {
          isViolated: true,
          message: `${first.name} has an invalid ${invalidDimensions}. Width and height must both be positive finite values.`,
          ...violatedSpaceIds(invalidSpaces),
        };
      },
    },
    {
      id: 'no-space-overlap',
      type: 'HARD',
      description: 'Spaces must not overlap',
      evaluate: (candidate) => {
        for (let index = 0; index < candidate.rooms.length; index += 1) {
          const first = candidate.rooms[index];
          for (let nextIndex = index + 1; nextIndex < candidate.rooms.length; nextIndex += 1) {
            const second = candidate.rooms[nextIndex];
            const overlap = getSpaceOverlap(first, second);
            if (overlap.area > 0) {
              return {
                isViolated: true,
                message: `${first.name} and ${second.name} overlap by ${formatArea(overlap.area)}.`,
                ...violatedSpaceIds([first, second]),
              };
            }
          }
        }

        return { isViolated: false };
      },
    },
  ];

  if (model.rooms.some(hasExplicitMinimumArea)) {
    constraints.push({
      id: 'explicit-minimum-area',
      type: 'HARD',
      description: 'Spaces with an explicit minimum area must meet it',
      evaluate: (candidate) => {
        const tooSmall = candidate.rooms.filter(isSpaceBelowMinimumArea);
        if (!tooSmall.length) return { isViolated: false };

        const first = tooSmall[0];
        const minimumArea = first.minArea;
        if (minimumArea === undefined) return { isViolated: false };
        return {
          isViolated: true,
          message: `${first.name} is ${formatArea(getSpaceArea(first))}, below its explicit ${formatArea(minimumArea)} minimum.`,
          ...violatedSpaceIds(tooSmall),
        };
      },
    });
  }

  const hasLiving = model.rooms.some(room => room.name.toLowerCase().includes('living'));
  const hasKitchen = model.rooms.some(room => room.name.toLowerCase().includes('kitchen'));
  if (hasLiving && hasKitchen) {
    constraints.push({
      id: 'kitchen-living-adj',
      type: 'HARD',
      description: 'Kitchen must share an edge with Living Room',
      evaluate: (candidate) => {
        const living = candidate.rooms.find(room => room.name.toLowerCase().includes('living'));
        const kitchen = candidate.rooms.find(room => room.name.toLowerCase().includes('kitchen'));
        const isAdjacent = shareRectangleEdge(living, kitchen);

        return {
          isViolated: !isAdjacent,
          message: !isAdjacent ? 'Kitchen does not share an edge with Living Room.' : undefined,
          ...(living && kitchen ? violatedSpaceIds([living, kitchen]) : {}),
        };
      },
    });
  }

  return constraints;
}

export function evaluateAllConstraints(model: SemanticModel) {
  const constraints = getDynamicConstraints(model);
  return constraints.map(constraint => ({
    constraint,
    result: constraint.evaluate(model),
  }));
}
