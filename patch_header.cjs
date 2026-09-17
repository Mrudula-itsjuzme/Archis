const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const saveBtn = `
          <button
            onClick={() => useStore.getState().saveCurrentProject()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            Save
          </button>
`;

if (!content.includes('saveCurrentProject()')) {
  content = content.replace(
    '<div className="flex items-center gap-3 shrink-0">',
    '<div className="flex items-center gap-3 shrink-0">\n' + saveBtn
  );
  fs.writeFileSync('src/App.tsx', content);
  console.log('App.tsx updated');
}
