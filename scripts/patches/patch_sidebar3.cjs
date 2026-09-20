const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

const replacement = `
          <div className="flex flex-col gap-0.5">
            <button 
              onClick={() => {
                useStore.setState(state => {
                  const newRoom = {
                    id: 'room-' + Date.now(),
                    name: 'New Room',
                    type: 'office',
                    shape: 'rect',
                    x: 5,
                    y: 5,
                    width: 4,
                    height: 4
                  };
                  return { 
                    model: { ...state.model, rooms: [...state.model.rooms, newRoom] },
                    selectedSpaceId: newRoom.id 
                  };
                });
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-indigo-600 hover:bg-indigo-50 font-semibold transition-colors"
            >
              <span className="text-base leading-none">＋</span>
              Add Space
            </button>
            {[
              { label: 'Blueprint Alignment', icon: '⊞' },
              { label: 'Measurement Tools', icon: '⟺' },
            ].map(t => (
              <button key={t.label} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium">
                <span className="text-base leading-none">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
`;

content = content.replace(
  /<div className="flex flex-col gap-0\.5">\s*\{\[\s*\{ label: 'Blueprint Alignment'.*?\n\s*\].map\(t => \(\s*<button key=\{t.label\}.*?>\s*<span.*?>\{t.icon\}<\/span>\s*\{t.label\}\s*<\/button>\s*\)\)\}\s*<\/div>/s,
  replacement
);

fs.writeFileSync('src/components/layout/Sidebar.tsx', content);
