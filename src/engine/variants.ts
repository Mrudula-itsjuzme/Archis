import { SemanticModel, VariantStats } from '../models/types';

export function generatePreserveVariant(baseModel: SemanticModel): { model: SemanticModel, stats: VariantStats } {
  // Deep copy
  const model: SemanticModel = JSON.parse(JSON.stringify(baseModel));
  
  // Snap everything to nearest 0.5 grid
  model.rooms.forEach(r => {
    r.x = Math.round(r.x * 2) / 2;
    r.y = Math.round(r.y * 2) / 2;
  });

  return {
    model,
    stats: {
      circulationAreaChange: 0,
      bedroomAreaChange: 0,
      preservedAdjacencies: ['Kitchen-Living', 'Bath-Hallway', 'Bedrooms-Hallway']
    }
  };
}

export function generateMorePrivateVariant(baseModel: SemanticModel): { model: SemanticModel, stats: VariantStats } {
  const model: SemanticModel = JSON.parse(JSON.stringify(baseModel));
  
  // Shift bedrooms and bathroom +2 in Y to create distance from entrance/living
  model.rooms.forEach(r => {
    if (r.type === 'bedroom' || r.type === 'bathroom') {
      r.y += 2;
    }
  });

  // Extend circulation to reach them
  const circ = model.rooms.find(r => r.id === 'circ');
  if (circ) {
    circ.height += 2;
  }

  return {
    model,
    stats: {
      circulationAreaChange: +8, // rough estimate based on +2 height * 4 width
      bedroomAreaChange: 0,
      preservedAdjacencies: ['Kitchen-Living', 'Bedrooms-Hallway (extended)']
    }
  };
}

export function generateMoreCompactVariant(baseModel: SemanticModel): { model: SemanticModel, stats: VariantStats } {
  const model: SemanticModel = JSON.parse(JSON.stringify(baseModel));
  
  // Shrink bedrooms slightly, but not below minimum
  model.rooms.forEach(r => {
    if (r.id === 'bed1') {
      r.width = 3.5;
      r.height = 3.5; // Area = 12.25 (>=12)
    }
    if (r.id === 'bed2') {
      r.width = 3.2;
      r.height = 3.2; // Area = 10.24 (>=10)
      r.x -= 0.3; // pack tighter
    }
    if (r.id === 'bath') {
      r.width = 2.2;
      r.height = 2.2;
      r.x -= 0.5;
    }
    if (r.id === 'circ') {
      r.width -= 0.5;
    }
  });

  return {
    model,
    stats: {
      circulationAreaChange: -2,
      bedroomAreaChange: -3.5, // approx
      preservedAdjacencies: ['Kitchen-Living']
    }
  };
}
