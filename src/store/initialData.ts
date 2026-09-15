import { SemanticModel } from '../models/types';

export const initialModel: SemanticModel = {
  rooms: [
    { id: 'living', name: 'Living Room', type: 'living', x: 0, y: 0, width: 6, height: 5, isLocked: false },
    { id: 'kitchen', name: 'Kitchen', type: 'kitchen', x: 6, y: 0, width: 4, height: 4, isLocked: false },
    { id: 'bed1', name: 'Bedroom 1', type: 'bedroom', x: 0, y: 5, width: 4, height: 4, isLocked: false, minArea: 12 },
    { id: 'bed2', name: 'Bedroom 2', type: 'bedroom', x: 4, y: 5, width: 3.5, height: 3.5, isLocked: false, minArea: 10 },
    { id: 'bath', name: 'Bathroom', type: 'bathroom', x: 7.5, y: 5, width: 2.5, height: 2.5, isLocked: false },
    { id: 'circ', name: 'Hallway', type: 'circulation', x: 6, y: 4, width: 4, height: 1, isLocked: false },
  ],
  doors: [
    { id: 'd1', room1Id: 'living', room2Id: 'kitchen' },
    { id: 'd2', room1Id: 'living', room2Id: 'circ' },
    { id: 'd3', room1Id: 'circ', room2Id: 'bed1' },
    { id: 'd4', room1Id: 'circ', room2Id: 'bed2' },
    { id: 'd5', room1Id: 'circ', room2Id: 'bath' },
  ]
};
