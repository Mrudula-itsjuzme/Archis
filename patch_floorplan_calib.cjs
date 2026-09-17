const fs = require('fs');
let content = fs.readFileSync('src/components/2d/FloorPlan.tsx', 'utf8');

if (!content.includes('calibrationMode')) {
  content = content.replace(
    "const setBlueprintConfig = useStore(state => state.setBlueprintConfig);",
    "const setBlueprintConfig = useStore(state => state.setBlueprintConfig);\n  const calibrationMode = useStore(s => s.calibrationMode);\n  const calibrationPt1 = useStore(s => s.calibrationPt1);\n  const setCalibrationMode = useStore(s => s.setCalibrationMode);"
  );

  const calibClick = `
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (calibrationMode === 'idle') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Calculate raw canvas coordinates
    const x = (e.clientX - rect.left) / scaleRef.current;
    const y = (e.clientY - rect.top) / scaleRef.current;

    if (calibrationMode === 'step1') {
      setCalibrationMode('step2', { x, y });
    } else if (calibrationMode === 'step2' && calibrationPt1) {
      const distPx = Math.sqrt(Math.pow(x - calibrationPt1.x, 2) + Math.pow(y - calibrationPt1.y, 2));
      const distMetersStr = prompt(\`Distance in pixels: \${Math.round(distPx)}\\nEnter the real-world distance in meters:\`, "1.0");
      if (distMetersStr) {
        const distM = parseFloat(distMetersStr);
        if (!isNaN(distM) && distM > 0) {
          const newScale = distPx / distM;
          setBlueprintConfig({ scale: newScale });
          alert(\`Scale calibrated to \${Math.round(newScale)} pixels per meter.\`);
        }
      }
      setCalibrationMode('idle', null);
    }
  };
`;

  content = content.replace(
    "const applyTransform = useCallback(() => {",
    calibClick + "\n  const applyTransform = useCallback(() => {"
  );

  content = content.replace(
    "onPointerCancel={handleCanvasPointerUp}",
    "onPointerCancel={handleCanvasPointerUp}\n      onClick={handleCanvasClick}"
  );

  const calibMarkers = `
        {/* Calibration Markers */}
        {calibrationMode !== 'idle' && calibrationPt1 && (
          <div className="absolute w-3 h-3 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none" style={{ left: calibrationPt1.x, top: calibrationPt1.y }} />
        )}
`;

  content = content.replace(
    "{/* Zoom % label */}",
    calibMarkers + "\n      {/* Zoom % label */}"
  );

  fs.writeFileSync('src/components/2d/FloorPlan.tsx', content);
}
