const fs = require('fs');
let content = fs.readFileSync('src/components/layout/RightSidebar.tsx', 'utf8');

content = content.replace(
  "const IMPACT_COLOR: Record<string, string> = {\n  high: 'border-rose-100 bg-rose-50',\n  medium: 'border-amber-100 bg-amber-50',\n  low: 'border-emerald-100 bg-emerald-50'\n};\n\nconst IMPACT_BADGE: Record<string, string> = {\n  high: 'bg-rose-200 text-rose-800',\n  medium: 'bg-amber-200 text-amber-800',\n  low: 'bg-emerald-200 text-emerald-800'\n};\n",
  ""
);

fs.writeFileSync('src/components/layout/RightSidebar.tsx', content);
