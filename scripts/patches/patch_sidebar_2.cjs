const fs = require('fs');

let content = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

const replacement = `
      <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-4">
        {/* Projects Tab View */}
        {activeNav === 'projects' && (
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Your Projects</div>
              <button 
                onClick={() => useStore.getState().fetchSavedProjects()}
                className="text-[10px] text-indigo-600 hover:underline"
              >
                Refresh
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {useStore.getState().savedProjects.map((p: any) => (
                <button
                  key={p.id}
                  onClick={() => {
                    useStore.getState().loadProject(p.id);
                    setActiveNav('blueprint');
                  }}
                  className="flex flex-col text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-colors"
                >
                  <span className="text-xs font-semibold text-gray-800">{p.name || 'Untitled Project'}</span>
                  <span className="text-[10px] text-gray-400 mt-1">
                    {p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                  </span>
                </button>
              ))}
              {useStore.getState().savedProjects.length === 0 && (
                <div className="text-xs text-gray-400 text-center py-4 bg-gray-50 rounded-lg">No saved projects yet.</div>
              )}
            </div>
          </div>
        )}

        <div className={activeNav !== 'blueprint' ? 'hidden' : 'flex flex-col gap-4'}>
          {/* Blueprint Input */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">Blueprint Input</div>
            <label className="cursor-pointer bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl hover:bg-blue-100 transition-colors flex flex-col items-center justify-center py-5 gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-blue-600">
                {blueprintUrl ? 'Replace Blueprint' : 'Upload Blueprint'}
              </span>
              <span className="text-[10px] text-gray-400">Drag & drop or browse</span>
              <span className="text-[10px] text-gray-300">PDF, PNG, JPG (max 50 MB)</span>
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleImageUpload} />
            </label>

            {blueprintUrl && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Blueprint Loaded
                  </span>
                  <button className="text-[10px] text-red-400 hover:text-red-600 font-medium" onClick={() => setBlueprintConfig({ url: null })}>Clear</button>
                </div>
                <button
                  onClick={() => useStore.getState().extractBlueprint()}
                  disabled={isExtracting}
                  className="w-full bg-gray-900 hover:bg-black text-white py-2 rounded-lg text-xs font-semibold transition-colors flex justify-center items-center gap-2 shadow-sm"
                >
                  {isExtracting ? (
                    <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Analyzing...</>
                  ) : '✨ Reconstruct Semantic Plan'}
                </button>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 mt-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1.5">Detection Results</p>
                  <div className="flex justify-between text-[11px] text-gray-600"><span>Spaces Detected</span><span className="font-bold text-gray-900">{model.rooms.length}</span></div>
                  <div className="flex justify-between text-[11px] text-gray-600 mt-1"><span>Levels Detected</span><span className="font-bold text-gray-900">1</span></div>
                  {model.rooms.length > 0 && <p className="text-[10px] text-emerald-600 mt-2 font-medium">✓ Spatial graph built successfully</p>}
                </div>
              </div>
            )}
          </div>

          {/* Tools */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">Tools</div>
            <div className="flex flex-col gap-0.5">
              {[
                { label: 'Blueprint Alignment', icon: '⊞' },
                { label: 'Manual Corrections', icon: '✎' },
                { label: 'Measurement Tools', icon: '⟺' },
              ].map(t => (
                <button key={t.label} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium">
                  <span className="text-base leading-none">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spaces list */}
          {model.rooms.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">Spaces</div>
              <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
                {model.rooms.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSpaceId(s.id)}
                    className={\`flex items-center gap-2 px-2 py-1.5 rounded text-[11px] transition-colors text-left \${selectedSpaceId === s.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}\`}
                  >
                    <span className="w-2 h-2 rounded-sm bg-gray-300 shrink-0" />
                    <span className="truncate">{s.name}</span>
                    <span className="ml-auto text-[10px] text-gray-400 shrink-0">{(s.width * s.height).toFixed(0)}m²</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
`;

// Extract everything from <div className="flex-1 overflow-y-auto... down to the </div> just before {/* Footer */}
const startIndex = content.indexOf('<div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-4">');
const endIndex = content.indexOf('{/* Footer */}');

if (startIndex !== -1 && endIndex !== -1) {
  // We need to find the matching closing div for the flex-1 container before Footer
  // Since it's exactly the div closing right before {/* Footer */}, we can just slice
  const match = content.substring(startIndex, content.lastIndexOf('</div>', endIndex) + 6);
  content = content.replace(match, replacement);
  fs.writeFileSync('src/components/layout/Sidebar.tsx', content);
  console.log("Updated Sidebar.tsx");
} else {
  console.log("Could not find bounds");
}
