const fs = require('fs');
let content = fs.readFileSync('src/models/types.ts', 'utf8');

const newTypes = `
export interface Vertex {
  id: string;
  x: number;
  y: number;
}

export interface Wall {
  id: string;
  startVertexId: string;
  endVertexId: string;
  thickness: number;
  isExterior: boolean;
}

export interface Opening {
  id: string;
  wallId: string;
  distanceAlongWall: number; // absolute distance from startVertex
  width: number;
  height: number;
  elevation: number; // height from floor
  type: 'door' | 'window' | 'entrance';
}
`;

content = content.replace(
  "export interface Space {",
  newTypes + "\nexport interface Space {\n  wallIds?: string[]; // IDs of walls forming this space\n  vertices?: string[]; // Ordered IDs of vertices forming the polygon"
);

content = content.replace(
  "export interface SemanticModel {",
  "export interface SemanticModel {\n  vertices: Vertex[];\n  walls: Wall[];\n  openings: Opening[];\n  scale: number; // pixels per meter"
);

fs.writeFileSync('src/models/types.ts', content);
