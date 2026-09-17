import { SemanticModel, Space, Vertex, Wall } from '../models/types';

export function migrateRectanglesToGraph(model: SemanticModel): SemanticModel {
  // If already populated, return it
  if (model.vertices && model.vertices.length > 0 && model.walls && model.walls.length > 0) {
    return model;
  }

  const vertices: Vertex[] = [];
  const walls: Wall[] = [];
  
  // To avoid duplicate vertices at the same coordinates, we'll use a coordinate map
  const vertexMap = new Map<string, string>();
  
  const getOrCreateVertex = (x: number, y: number): string => {
    // Round to 2 decimal places to catch very close points as same vertex (snapping)
    const key = `${x.toFixed(2)},${y.toFixed(2)}`;
    if (vertexMap.has(key)) return vertexMap.get(key)!;
    
    const id = `v_${vertices.length}`;
    vertices.push({ id, x, y });
    vertexMap.set(key, id);
    return id;
  };

  const getOrCreateWall = (v1: string, v2: string): string => {
    // Check if wall exists between these two
    const existing = walls.find(w => 
      (w.startVertexId === v1 && w.endVertexId === v2) || 
      (w.startVertexId === v2 && w.endVertexId === v1)
    );
    if (existing) return existing.id;
    
    const id = `w_${walls.length}`;
    walls.push({
      id,
      startVertexId: v1,
      endVertexId: v2,
      thickness: 0.2, // Default 20cm walls
      isExterior: false // Can be calculated later by finding outline
    });
    return id;
  };

  const migratedRooms = model.rooms.map(room => {
    // If it already has walls, just return it
    if (room.wallIds && room.wallIds.length > 0) return room;

    const vTL = getOrCreateVertex(room.x, room.y);
    const vTR = getOrCreateVertex(room.x + room.width, room.y);
    const vBR = getOrCreateVertex(room.x + room.width, room.y + room.height);
    const vBL = getOrCreateVertex(room.x, room.y + room.height);

    const wTop = getOrCreateWall(vTL, vTR);
    const wRight = getOrCreateWall(vTR, vBR);
    const wBottom = getOrCreateWall(vBR, vBL);
    const wLeft = getOrCreateWall(vBL, vTL);

    return {
      ...room,
      wallIds: [wTop, wRight, wBottom, wLeft],
      vertices: [vTL, vTR, vBR, vBL]
    };
  });

  return {
    ...model,
    vertices,
    walls,
    openings: model.openings || [],
    rooms: migratedRooms,
    scale: model.scale || 40
  };
}
