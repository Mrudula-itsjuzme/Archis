const fs = require('fs');
let content = fs.readFileSync('src/models/types.ts', 'utf8');

// Ensure they are optional during the transition
content = content.replace(
  "export interface SemanticModel {\n  vertices: Vertex[];\n  walls: Wall[];\n  openings: Opening[];\n  scale: number; // pixels per meter",
  "export interface SemanticModel {\n  vertices?: Vertex[];\n  walls?: Wall[];\n  openings?: Opening[];\n  scale?: number; // pixels per meter"
);

fs.writeFileSync('src/models/types.ts', content);
