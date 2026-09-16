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

export function getDynamicConstraints(model: SemanticModel): Constraint[] {
  const constraints: Constraint[] = [];

  // 1. Generic no-overlap constraint
  constraints.push({
    id: 'no-overlap',
    type: 'HARD',
    description: 'Rooms should not overlap substantially',
    evaluate: (m) => {
      for (let i = 0; i < m.rooms.length; i++) {
        for (let j = i + 1; j < m.rooms.length; j++) {
          const r1 = m.rooms[i];
          const r2 = m.rooms[j];
          const buffer = -0.5; // Allow minor overlaps but flag > 0.5m
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
  });

  // 2. Minimum Area Checks based on room types present
  const classrooms = model.rooms.filter(r => r.name.toLowerCase().includes('class'));
  if (classrooms.length > 0) {
    constraints.push({
      id: 'classroom-area',
      type: 'HARD',
      description: 'Classrooms >= 30 m²',
      evaluate: (m) => {
        const tooSmall = m.rooms.filter(r => r.name.toLowerCase().includes('class') && (r.width * r.height) < 30);
        if (tooSmall.length > 0) {
          return {
            isViolated: true,
            message: `${tooSmall[0].name} is ${(tooSmall[0].width * tooSmall[0].height).toFixed(1)} m², below 30 m² minimum.`,
            violatingRoomIds: tooSmall.map(r => r.id)
          };
        }
        return { isViolated: false };
      }
    });
  }

  const labs = model.rooms.filter(r => r.name.toLowerCase().includes('lab'));
  if (labs.length > 0) {
    constraints.push({
      id: 'lab-area',
      type: 'HARD',
      description: 'Laboratories >= 40 m²',
      evaluate: (m) => {
        const tooSmall = m.rooms.filter(r => r.name.toLowerCase().includes('lab') && (r.width * r.height) < 40);
        if (tooSmall.length > 0) {
          return {
            isViolated: true,
            message: `${tooSmall[0].name} is ${(tooSmall[0].width * tooSmall[0].height).toFixed(1)} m², below 40 m² minimum.`,
            violatingRoomIds: tooSmall.map(r => r.id)
          };
        }
        return { isViolated: false };
      }
    });
  }

  // 3. Residential fallback constraints (only if residential rooms exist)
  const hasLiving = model.rooms.some(r => r.name.toLowerCase().includes('living'));
  const hasKitchen = model.rooms.some(r => r.name.toLowerCase().includes('kitchen'));
  if (hasLiving && hasKitchen) {
    constraints.push({
      id: 'kitchen-living-adj',
      type: 'HARD',
      description: 'Kitchen must be adjacent to Living Room',
      evaluate: (m) => {
        const living = m.rooms.find(r => r.name.toLowerCase().includes('living'));
        const kitchen = m.rooms.find(r => r.name.toLowerCase().includes('kitchen'));
        const isAdjacent = checkAdjacency(living, kitchen);
        return {
          isViolated: !isAdjacent,
          message: !isAdjacent ? 'Kitchen is not adjacent to Living Room.' : undefined,
          violatingRoomIds: !isAdjacent && living && kitchen ? [living.id, kitchen.id] : []
        };
      }
    });
  }

  const bedrooms = model.rooms.filter(r => r.name.toLowerCase().includes('bed'));
  if (bedrooms.length > 0) {
    constraints.push({
      id: 'bedroom-area',
      type: 'HARD',
      description: 'Bedrooms >= 10 m²',
      evaluate: (m) => {
        const tooSmall = m.rooms.filter(r => r.name.toLowerCase().includes('bed') && (r.width * r.height) < 10);
        if (tooSmall.length > 0) {
          return {
            isViolated: true,
            message: `${tooSmall[0].name} is ${(tooSmall[0].width * tooSmall[0].height).toFixed(1)} m², below 10 m² minimum.`,
            violatingRoomIds: tooSmall.map(r => r.id)
          };
        }
        return { isViolated: false };
      }
    });
  }

  return constraints;
}

export function evaluateAllConstraints(model: SemanticModel) {
  const constraints = getDynamicConstraints(model);
  return constraints.map(c => ({
    constraint: c,
    result: c.evaluate(model)
  }));
}
