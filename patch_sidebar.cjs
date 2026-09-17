const fs = require('fs');

let content = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

// The activeNav is handled by useState('blueprint').
// We can conditionally render the Projects list when activeNav === 'projects'
const newProjectsRender = `
        {/* Projects Tab View */}
        {activeNav === 'projects' && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">Your Projects</div>
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
                  <span className="text-[10px] text-gray-400">
                    {p.updatedAt ? new Date(p.updatedAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                  </span>
                </button>
              ))}
              {useStore.getState().savedProjects.length === 0 && (
                <div className="text-xs text-gray-400 text-center py-4">No saved projects yet.</div>
              )}
            </div>
          </div>
        )}
`;

if (!content.includes('Your Projects')) {
  content = content.replace(
    "{/* Blueprint Input */}",
    newProjectsRender + "\n        {/* Blueprint Input */}\n        <div className={activeNav !== 'blueprint' ? 'hidden' : ''}>"
  );
  content = content.replace(
    "<div>\n          <div className=\"text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1\">Tools</div>",
    "</div>\n        <div className={activeNav !== 'blueprint' ? 'hidden' : ''}>\n          <div className=\"text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1\">Tools</div>"
  );
  content = content.replace(
    "<div>\n            <div className=\"text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1\">Spaces</div>",
    "</div>\n        <div className={activeNav !== 'blueprint' ? 'hidden' : ''}>\n            <div className=\"text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1\">Spaces</div>"
  );
  content = content.replace(
    "            </div>\n          </div>\n        )}",
    "            </div>\n          </div>\n        )}\n      </div>"
  );
}

// Ensure the outer div wraps everything correctly.
// Let's check the structural changes first. Actually a replace_file_content would be safer.
