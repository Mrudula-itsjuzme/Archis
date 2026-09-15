import { SemanticModel, Constraint, ConstraintResult, Room } from '../models/types';

// Helper for AABB intersection
function checkAdjacency(r1?: Room, r2?: Room): boolean {
  if (!r1 || !r2) return false;
  const buffer = 0.1; // 10cm tolerance
  return (
    r1.x < r2.x + r2.width + buffer &&
    r1.x + r1.width > r2.x - buffer &&
    r1.y < r2.y + r2.height + buffer &&
    r1.y + r1.height > r2.y - buffer
  );
}

export const hardConstraints: Constraint[] = [
  {
    id: 'bed1-area',
    type: 'HARD',
    description: 'Bedroom 1 area >= 12 m²',
    evaluate: (model) => {
      const b1 = model.rooms.find(r => r.id === 'bed1');
      if (!b1) return { isViolated: false };
      const area = b1.width * b1.height;
      return {
        isViolated: area < 12,
        message: area < 12 ? `Bedroom 1 is ${area.toFixed(1)} m², below 12 m² minimum.` : undefined,
        violatingRoomIds: area < 12 ? ['bed1'] : []
      };
    }
  },
  {
    id: 'bed2-area',
    type: 'HARD',
    description: 'Bedroom 2 area >= 10 m²',
    evaluate: (model) => {
      const b2 = model.rooms.find(r => r.id === 'bed2');
      if (!b2) return { isViolated: false };
      const area = b2.width * b2.height;
      return {
        isViolated: area < 10,
        message: area < 10 ? `Bedroom 2 is ${area.toFixed(1)} m², below 10 m² minimum.` : undefined,
        violatingRoomIds: area < 10 ? ['bed2'] : []
      };
    }
  },
  {
    id: 'kitchen-living-adj',
    type: 'HARD',
    description: 'Kitchen must be adjacent to Living Room',
    evaluate: (model) => {
      const living = model.rooms.find(r => r.id === 'living');
      const kitchen = model.rooms.find(r => r.id === 'kitchen');
      const isAdjacent = checkAdjacency(living, kitchen);
      return {
        isViolated: !isAdjacent,
        message: !isAdjacent ? 'Kitchen is no longer adjacent to Living Room.' : undefined,
        violatingRoomIds: !isAdjacent ? ['living', 'kitchen'] : []
      };
    }
  },
  {
    id: 'no-overlap',
    type: 'HARD',
    description: 'Rooms should not overlap substantially',
    evaluate: (model) => {
      // Simplified overlap check
      for (let i = 0; i < model.rooms.length; i++) {
        for (let j = i + 1; j < model.rooms.length; j++) {
          const r1 = model.rooms[i];
          const r2 = model.rooms[j];
          // Check deep intersection > 0.5m
          const buffer = -0.5;
          if (
            r1.x < r2.x + r2.width + buffer &&
            r1.x + r1.width > r2.x - buffer &&
            r1.y < r2.y + r2.height + buffer &&
            r1.y + r1.height > r2.y - buffer
          ) {
            return {
              isViolated: true,
              message: `${r1.name} and ${r2.name} are overlapping.`,
              violatingRoomIds: [r1.id, r2.id]
            };
          }
        }
      }
      return { isViolated: false };
    }
  }
];

export function evaluateAllConstraints(model: SemanticModel) {
  return hardConstraints.map(c => ({
    constraint: c,
    result: c.evaluate(model)
  }));
}
