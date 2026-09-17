const fs = require('fs');
let content = fs.readFileSync('src/components/layout/RightSidebar.tsx', 'utf8');

content = content.replace(/rec\.priority/g, "rec.impact");
content = content.replace(/PRIORITY_COLOR/g, "IMPACT_COLOR");
content = content.replace(/PRIORITY_BADGE/g, "IMPACT_BADGE");
content = content.replace(/rec\.category/g, "'optimization'");
content = content.replace(/c\.spaceName/g, "c.spaceId");
content = content.replace(/c\.reason/g, "rec.description");

const colors = `
const IMPACT_COLOR: Record<string, string> = {
  high: 'border-rose-100 bg-rose-50',
  medium: 'border-amber-100 bg-amber-50',
  low: 'border-emerald-100 bg-emerald-50'
};

const IMPACT_BADGE: Record<string, string> = {
  high: 'bg-rose-200 text-rose-800',
  medium: 'bg-amber-200 text-amber-800',
  low: 'bg-emerald-200 text-emerald-800'
};
`;

content = content.replace(
  "const CATEGORY_ICON: Record<string, string> = {",
  colors + "\nconst CATEGORY_ICON: Record<string, string> = {"
);

// We need to also remove or replace the old PRIORITY_COLOR if it was there.
// Actually, let's just do a sed-like surgical replacement or manually edit it.
fs.writeFileSync('src/components/layout/RightSidebar.tsx', content);
