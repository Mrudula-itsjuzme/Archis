const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import { downloadFloorPlanSVG }')) {
  content = content.replace(
    "import AuthAvatar from './components/ui/AuthAvatar';",
    "import AuthAvatar from './components/ui/AuthAvatar';\nimport { downloadFloorPlanSVG } from './utils/exportSVG';"
  );
}

const svgBtn = `
            <button
              onClick={() => downloadFloorPlanSVG(useStore.getState().model)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export 2D SVG
            </button>
`;

if (!content.includes('Export 2D SVG')) {
  content = content.replace(
    "Export GLTF\n            </button>",
    "Export GLTF\n            </button>\n" + svgBtn
  );
  fs.writeFileSync('src/App.tsx', content);
}
