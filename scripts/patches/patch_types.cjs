const fs = require('fs');

let geminiContent = fs.readFileSync('src/store/gemini.ts', 'utf8');
geminiContent = geminiContent.replace(
  "export interface RecommendationChange {\n  roomId: string;\n  type: 'resize' | 'move' | 'rename' | 'retype';\n  width?: number;\n  height?: number;\n  x?: number;\n  y?: number;\n  name?: string;\n  roomType?: string;\n}",
  "export interface RecommendationChange {\n  spaceId: string;\n  type: 'resize' | 'move' | 'rename' | 'retype';\n  newWidth?: number;\n  newHeight?: number;\n  newX?: number;\n  newY?: number;\n  newName?: string;\n  newRoomType?: string;\n}"
);
geminiContent = geminiContent.replace(
  "export interface Recommendation {\n  title: string;\n  description: string;\n  impact: 'high' | 'medium' | 'low';\n  changes: RecommendationChange[];\n}",
  "export interface Recommendation {\n  id: string;\n  title: string;\n  description: string;\n  impact: 'high' | 'medium' | 'low';\n  changes: RecommendationChange[];\n}"
);
fs.writeFileSync('src/store/gemini.ts', geminiContent);
