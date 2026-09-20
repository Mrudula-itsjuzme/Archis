const fs = require('fs');
let content = fs.readFileSync('src/store/useStore.ts', 'utf8');

if (!content.includes('triggerExport3D')) {
  // interface
  content = content.replace(
    "isExtracting: boolean;",
    "isExtracting: boolean;\n  triggerExport3D: boolean;\n  setTriggerExport3D: (trigger: boolean) => void;"
  );
  // implementation
  content = content.replace(
    "isExtracting: false,",
    "isExtracting: false,\n  triggerExport3D: false,\n  setTriggerExport3D: (t) => set({ triggerExport3D: t }),"
  );
  fs.writeFileSync('src/store/useStore.ts', content);
}
