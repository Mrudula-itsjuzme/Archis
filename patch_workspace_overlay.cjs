const fs = require('fs');
let content = fs.readFileSync('src/components/layout/MainWorkspace.tsx', 'utf8');

// We need to import blueprintOpacity and setBlueprintOpacity if not present.
// Since useStore is used directly: `useStore.getState().setBlueprintConfig({ opacity: val })` 
// But we need the reactive value. Let's add them to the top.

if (!content.includes('const blueprintOpacity')) {
  content = content.replace(
    "const isExtracting = useStore(state => state.isExtracting);",
    "const isExtracting = useStore(state => state.isExtracting);\n  const blueprintOpacity = useStore(state => state.blueprintOpacity);\n  const setBlueprintConfig = useStore(state => state.setBlueprintConfig);"
  );
}

// Update the 2D panel header
const newHeader = `
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                {[
                  { key: 'original', label: 'Original Blueprint' },
                  { key: 'overlay', label: 'Semantic Overlay' },
                  { key: 'clean', label: 'Clean Plan' },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setPlan2dTab(t.key as any)}
                    className={\`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all \${plan2dTab === t.key ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}\`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              
              {plan2dTab === 'overlay' && (
                <div className="flex items-center gap-2 px-2 border-l border-gray-200">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase">Opacity</span>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.05" 
                    value={blueprintOpacity} 
                    onChange={e => setBlueprintConfig({ opacity: parseFloat(e.target.value) })}
                    className="w-20"
                  />
                </div>
              )}
`;

content = content.replace(
  /<div className="flex bg-gray-100 rounded-lg p-0\.5">.*?<\/div>/s,
  newHeader
);

fs.writeFileSync('src/components/layout/MainWorkspace.tsx', content);
