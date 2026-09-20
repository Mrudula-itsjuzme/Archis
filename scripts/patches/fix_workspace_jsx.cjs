const fs = require('fs');
let content = fs.readFileSync('src/components/layout/MainWorkspace.tsx', 'utf8');

content = content.replace(
  "{plan2dTab === 'overlay' && (\n                <div className=\"flex items-center gap-2 px-2 border-l border-gray-200\">",
  "{plan2dTab === 'overlay' && (\n              <>\n                <div className=\"flex items-center gap-2 px-2 border-l border-gray-200\">"
);

content = content.replace(
  "{calibrationMode === 'step2' && <span className=\"text-[10px] text-red-600 font-medium\">Click 2nd point</span>}\n                </div>\n              )}",
  "{calibrationMode === 'step2' && <span className=\"text-[10px] text-red-600 font-medium\">Click 2nd point</span>}\n                </div>\n              </>\n              )}"
);

fs.writeFileSync('src/components/layout/MainWorkspace.tsx', content);
