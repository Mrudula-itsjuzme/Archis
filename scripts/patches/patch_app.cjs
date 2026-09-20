const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
if (!content.includes('import AuthAvatar')) {
  content = content.replace(
    "import { useStore } from './store/useStore';",
    "import { useStore } from './store/useStore';\nimport AuthAvatar from './components/ui/AuthAvatar';"
  );
}

// Replace the hardcoded avatar with AuthAvatar
if (content.includes('<div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">JD</div>')) {
  content = content.replace(
    '<div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">JD</div>',
    '<AuthAvatar />'
  );
}

fs.writeFileSync('src/App.tsx', content);
