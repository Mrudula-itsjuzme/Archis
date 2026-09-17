const fs = require('fs');
let content = fs.readFileSync('src/components/layout/RightSidebar.tsx', 'utf8');

if (!content.includes('import SpacePropertiesPanel')) {
  content = content.replace(
    "import IntentPanel from '../ui/IntentPanel';",
    "import IntentPanel from '../ui/IntentPanel';\nimport SpacePropertiesPanel from '../ui/SpacePropertiesPanel';"
  );
}

// Add it to the top of the flex container for content
content = content.replace(
  '<div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">',
  '<div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">\n        <SpacePropertiesPanel />'
);

fs.writeFileSync('src/components/layout/RightSidebar.tsx', content);
