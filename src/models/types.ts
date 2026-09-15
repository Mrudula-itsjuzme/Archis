export type RoomType = 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'circulation';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  x: number;
  y: number;
  width: number;
  height: number;
  isLocked: boolean;
  minArea?: number;
}

export interface Door {
  id: string;
  room1Id: string;
  room2Id: string;
}

export interface SemanticModel {
  rooms: Room[];
  doors: Door[];
}

export interface ConstraintResult {
  isViolated: boolean;
  message?: string;
  violatingRoomIds?: string[];
}

export interface Constraint {
  id: string;
  type: 'HARD' | 'SOFT';
  description: string;
  evaluate: (model: SemanticModel) => ConstraintResult;
}

export type VariantType = 'original' | 'private' | 'compact';

export interface VariantStats {
  circulationAreaChange: number;
  bedroomAreaChange: number;
  preservedAdjacencies: string[];
}
