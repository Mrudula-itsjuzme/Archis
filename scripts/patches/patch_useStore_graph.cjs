const fs = require('fs');
let content = fs.readFileSync('src/store/useStore.ts', 'utf8');

if (!content.includes('import { migrateRectanglesToGraph }')) {
  content = content.replace(
    "import { SemanticModel, Space, VariantType, ChangeEvent, Project } from '../models/types';",
    "import { SemanticModel, Space, VariantType, ChangeEvent, Project } from '../models/types';\nimport { migrateRectanglesToGraph } from '../utils/geometryGraph';"
  );
  
  // Make initialModel migrated
  content = content.replace(
    "model: initialModel,",
    "model: migrateRectanglesToGraph(initialModel),"
  );
  content = content.replace(
    "originalModel: initialModel,",
    "originalModel: migrateRectanglesToGraph(initialModel),"
  );
  
  // When loading from Gemini (extractBlueprint)
  // Look for: const data = await extractRoomsWithGemini(base64Image, 'API_KEY');
  content = content.replace(
    /const newModel: SemanticModel = \{\s+project: \{\s+id: 'proj_' \+ Date\.now\(\),\s+name: 'New Project',\s+buildings: \[\]\s+\},\s+activeLevelId: 'lvl1',\s+rooms,\s+doors: \[\],\s+furniture: \[\],\s+\};/s,
    `const newModel: SemanticModel = migrateRectanglesToGraph({
          project: { id: 'proj_' + Date.now(), name: 'New Project', buildings: [] },
          activeLevelId: 'lvl1',
          rooms,
          doors: [],
          furniture: [],
        });`
  );

  fs.writeFileSync('src/store/useStore.ts', content);
}
