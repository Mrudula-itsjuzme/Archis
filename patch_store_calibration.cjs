const fs = require('fs');
let content = fs.readFileSync('src/store/useStore.ts', 'utf8');

if (!content.includes('calibrationMode')) {
  content = content.replace(
    "blueprintOpacity: number;",
    "blueprintOpacity: number;\n  calibrationMode: 'idle' | 'step1' | 'step2';\n  calibrationPt1: {x: number, y: number} | null;\n  setCalibrationMode: (mode: 'idle' | 'step1' | 'step2', pt?: {x: number, y: number}) => void;"
  );
  
  content = content.replace(
    "blueprintOpacity: 0.5,",
    "blueprintOpacity: 0.5,\n  calibrationMode: 'idle',\n  calibrationPt1: null,\n  setCalibrationMode: (mode, pt) => set(s => ({ calibrationMode: mode, calibrationPt1: pt || s.calibrationPt1 })),"
  );
  
  fs.writeFileSync('src/store/useStore.ts', content);
}
