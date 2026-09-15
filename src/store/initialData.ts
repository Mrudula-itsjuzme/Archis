import { SemanticModel, Project, Space } from '../models/types';

const courtyardSpaces: Space[] = [
  { id: 'living', name: 'Living Area', type: 'living', x: 0, y: 0, width: 8, height: 6, isLocked: false },
  { id: 'kitchen', name: 'Open Kitchen', type: 'kitchen', x: 8, y: 0, width: 4, height: 6, isLocked: false },
  { id: 'courtyard', name: 'Central Courtyard', type: 'courtyard', x: 4, y: 6, width: 8, height: 6, isLocked: true },
  { id: 'bed1', name: 'Primary Bedroom', type: 'bedroom', x: 0, y: 6, width: 4, height: 6, isLocked: false, minArea: 16 },
  { id: 'bed2', name: 'Guest Bedroom', type: 'bedroom', x: 0, y: 12, width: 4, height: 5, isLocked: false, minArea: 12 },
  { id: 'bath', name: 'Shared Bath', type: 'bathroom', x: 4, y: 12, width: 3, height: 5, isLocked: false },
  { id: 'corridor', name: 'Glass Corridor', type: 'circulation', x: 7, y: 12, width: 5, height: 2, isLocked: false },
];

export const courtyardHouseProject: Project = {
  id: 'proj_courtyard',
  name: 'Courtyard House',
  buildings: [
    {
      id: 'b1',
      name: 'Main House',
      levels: [
        {
          id: 'lvl1',
          name: 'Ground Floor',
          elevation: 0,
          spaces: courtyardSpaces,
          doors: [],
          furniture: [
            { id: "f_sofa1", spaceId: "living", type: "sofa", x: 1, y: 1, width: 2.2, depth: 0.9, rotation: 0 },
            { id: "f_table1", spaceId: "kitchen", type: "table", x: 0, y: 0, width: 2.0, depth: 1.0, rotation: 90 },
            { id: "f_bed1", spaceId: "bed1", type: "bed", x: 0.5, y: 0.5, width: 1.8, depth: 2.0, rotation: 0 },
          ]
        }
      ]
    }
  ]
};

const apartmentSpaces: Space[] = [
  { id: 'corr', name: 'Common Corridor', type: 'corridor', x: 0, y: 5, width: 20, height: 2, isLocked: true },
  { id: 'stair', name: 'Stair Core', type: 'stair', x: 8, y: 7, width: 4, height: 4, isLocked: true },
  { id: 'u1_liv', name: 'Unit 1 Living', type: 'living', x: 0, y: 0, width: 6, height: 5, isLocked: false },
  { id: 'u1_bed', name: 'Unit 1 Bed', type: 'bedroom', x: 6, y: 0, width: 4, height: 5, isLocked: false },
  { id: 'u2_liv', name: 'Unit 2 Living', type: 'living', x: 10, y: 0, width: 6, height: 5, isLocked: false },
  { id: 'u2_bed', name: 'Unit 2 Bed', type: 'bedroom', x: 16, y: 0, width: 4, height: 5, isLocked: false },
];

export const apartmentFloorProject: Project = {
  id: 'proj_apt',
  name: 'Apartment Floor',
  buildings: [
    {
      id: 'b1',
      name: 'Tower A',
      levels: [
        {
          id: 'lvl1',
          name: 'Level 04',
          elevation: 12,
          spaces: apartmentSpaces,
          doors: [],
          furniture: []
        }
      ]
    }
  ]
};

const schoolSpaces: Space[] = [
  { id: 'corr', name: 'Main Corridor', type: 'corridor', x: 0, y: 8, width: 30, height: 3, isLocked: true },
  { id: 'c1', name: 'Classroom 01', type: 'classroom', x: 0, y: 0, width: 8, height: 8, isLocked: false, minArea: 60 },
  { id: 'c2', name: 'Classroom 02', type: 'classroom', x: 8, y: 0, width: 8, height: 8, isLocked: false, minArea: 60 },
  { id: 'c3', name: 'Classroom 03', type: 'classroom', x: 16, y: 0, width: 8, height: 8, isLocked: false, minArea: 60 },
  { id: 'lab', name: 'Science Lab', type: 'lab', x: 24, y: 0, width: 10, height: 8, isLocked: false, minArea: 80 },
];

export const schoolWingProject: Project = {
  id: 'proj_school',
  name: 'School Wing',
  buildings: [
    {
      id: 'b1',
      name: 'North Wing',
      levels: [
        {
          id: 'lvl1',
          name: 'Ground Floor',
          elevation: 0,
          spaces: schoolSpaces,
          doors: [],
          furniture: []
        }
      ]
    }
  ]
};

// Default export
export const initialModel: SemanticModel = {
  project: courtyardHouseProject,
  activeLevelId: 'lvl1',
  rooms: courtyardHouseProject.buildings[0].levels[0].spaces,
  doors: courtyardHouseProject.buildings[0].levels[0].doors,
  furniture: courtyardHouseProject.buildings[0].levels[0].furniture,
};
