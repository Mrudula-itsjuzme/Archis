export type SpaceType = 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'circulation' | 'office' | 'classroom' | 'lab' | 'corridor' | 'courtyard' | 'stair' | 'retail' | 'utility' | 'lobby' | 'outdoor';
export type FurnitureType = 'bed' | 'sofa' | 'table' | 'counter' | 'toilet' | 'bathtub' | 'desk';

export interface Space {
  id: string;
  name: string;
  type: SpaceType;
  x: number;
  y: number;
  width: number;
  height: number;
  isLocked: boolean;
  minArea?: number;
}

// For backward compatibility during migration, alias Room to Space
export type Room = Space;
export type RoomType = SpaceType;

export interface Furniture {
  id: string;
  spaceId: string;
  type: FurnitureType;
  x: number; // Relative to space center
  y: number; // Relative to space center
  width: number;
  depth: number;
  rotation: number; // Degrees
}

export interface Door {
  id: string;
  space1Id: string;
  space2Id: string;
}

export interface Level {
  id: string;
  name: string;
  spaces: Space[];
  doors: Door[];
  furniture: Furniture[];
  elevation: number;
}

export interface Building {
  id: string;
  name: string;
  levels: Level[];
}

export interface Project {
  id: string;
  name: string;
  buildings: Building[];
}

export interface SemanticModel {
  project: Project;
  activeLevelId: string;
  
  // Legacy fields for fast backward compatibility during migration
  rooms: Space[];
  doors: Door[];
  furniture?: Furniture[];
}

export interface ChangeEvent {
  id: string;
  timestamp: number;
  description: string;
  details: {
    category: 'Geometry' | 'Relationship' | 'Intent' | 'Constraint';
    message: string;
    metric?: string;
    delta?: string;
  }[];
}

export interface IntentResult {
  id: string;
  name: string;
  score: number; // 0 to 1
  description: string;
  isImproved?: boolean;
}

export interface ConstraintResult {
  isViolated: boolean;
  message?: string;
  violatingSpaceIds?: string[];
}

export interface Constraint {
  id: string;
  type: 'HARD' | 'SOFT';
  description: string;
  evaluate: (model: SemanticModel) => ConstraintResult;
}

export type VariantType = 'original' | 'private' | 'compact' | 'option-a' | 'option-b';

export interface VariantStats {
  circulationAreaChange: number;
  primaryAreaChange: number;
  preservedAdjacencies: string[];
}
