const fs = require('fs');
let content = fs.readFileSync('src/components/layout/MainWorkspace.tsx', 'utf8');

if (!content.includes('calibrationMode')) {
  content = content.replace(
    "const setBlueprintConfig = useStore(state => state.setBlueprintConfig);",
    "const setBlueprintConfig = useStore(state => state.setBlueprintConfig);\n  const calibrationMode = useStore(state => state.calibrationMode);\n  const setCalibrationMode = useStore(state => state.setCalibrationMode);"
  );

  const calibBtn = `
                <div className="flex items-center gap-2 px-2 border-l border-gray-200">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase">Opacity</span>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.05" 
                    value={blueprintOpacity} 
                    onChange={e => setBlueprintConfig({ opacity: parseFloat(e.target.value) })}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center gap-2 px-2 border-l border-gray-200">
                  <button 
                    onClick={() => setCalibrationMode(calibrationMode === 'idle' ? 'step1' : 'idle')}
                    className={\`text-[10px] font-semibold px-2 py-1 rounded \${calibrationMode !== 'idle' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}\`}
                  >
                    {calibrationMode !== 'idle' ? 'Cancel Calibration' : '📏 Calibrate Scale'}
                  </button>
                  {calibrationMode === 'step1' && <span className="text-[10px] text-red-600 font-medium">Click 1st point</span>}
                  {calibrationMode === 'step2' && <span className="text-[10px] text-red-600 font-medium">Click 2nd point</span>}
                </div>
  `;

  content = content.replace(
    /<div className="flex items-center gap-2 px-2 border-l border-gray-200">\s*<span className="text-\[10px\] text-gray-500 font-semibold uppercase">Opacity<\/span>\s*<input\s*type="range"\s*min="0" max="1" step="0\.05"\s*value=\{blueprintOpacity\}\s*onChange=\{e => setBlueprintConfig\(\{ opacity: parseFloat\(e\.target\.value\) \}\)\}\s*className="w-20"\s*\/>\s*<\/div>/,
    calibBtn
  );

  fs.writeFileSync('src/components/layout/MainWorkspace.tsx', content);
}
