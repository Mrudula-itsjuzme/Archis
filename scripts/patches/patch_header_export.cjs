const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const exportBtn = `
          {rooms.length > 0 && (
            <button
              onClick={() => useStore.getState().setTriggerExport3D(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export GLTF
            </button>
          )}
`;

if (!content.includes('Export GLTF')) {
  content = content.replace(
    '<div className="flex items-center gap-3 shrink-0">',
    '<div className="flex items-center gap-3 shrink-0">\n' + exportBtn
  );
  fs.writeFileSync('src/App.tsx', content);
}
