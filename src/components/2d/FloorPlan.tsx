import { useRef, useCallback, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import Room2D from './Room2D';

interface FloorPlanProps {
  view?: 'original' | 'overlay' | 'clean';
}

export default function FloorPlan({ view = 'clean' }: FloorPlanProps) {
  const model = useStore(state => state.model);
  const previewVariantModel = useStore(state => state.previewVariantModel);
  const blueprintUrl = useStore(state => state.blueprintUrl);
  const opacity = useStore(state => state.blueprintOpacity);
  const bpScale = useStore(state => state.blueprintScale);
  const rotation = useStore(state => state.blueprintRotation);
  const bpOffsetX = useStore(state => state.blueprintOffsetX);
  const bpOffsetY = useStore(state => state.blueprintOffsetY);
  const locked = useStore(state => state.blueprintLocked);
  const setBlueprintConfig = useStore(state => state.setBlueprintConfig);
  const calibrationMode = useStore(s => s.calibrationMode);
  const calibrationPt1 = useStore(s => s.calibrationPt1);
  const setCalibrationMode = useStore(s => s.setCalibrationMode);

  const SCALE = 40;
  const OFFSET_X = 60;
  const OFFSET_Y = 60;

  // Use refs for pan/zoom — avoid React re-renders on every mousemove
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const panRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const zoomDisplay = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);

  
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
      const distMetersStr = prompt(`Distance in pixels: ${Math.round(distPx)}\nEnter the real-world distance in meters:`, "1.0");
      if (distMetersStr) {
        const distM = parseFloat(distMetersStr);
        if (!isNaN(distM) && distM > 0) {
          const newScale = distPx / distM;
          setBlueprintConfig({ scale: newScale });
          alert(`Scale calibrated to ${Math.round(newScale)} pixels per meter.`);
        }
      }
      setCalibrationMode('idle');
    }
  };

  const applyTransform = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.style.transform = `translate(${panRef.current.x}px, ${panRef.current.y}px) scale(${scaleRef.current})`;
    }
    if (zoomDisplay.current) {
      zoomDisplay.current.textContent = `${Math.round(scaleRef.current * 100)}%`;
    }
  }, []);

  const setZoom = useCallback((newScale: number) => {
    scaleRef.current = Math.min(4, Math.max(0.15, newScale));
    applyTransform();
  }, [applyTransform]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    scaleRef.current = Math.min(4, Math.max(0.15, scaleRef.current + delta * scaleRef.current));
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(applyTransform);
  }, [applyTransform]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => { el.removeEventListener('wheel', handleWheel); cancelAnimationFrame(rafId.current); };
  }, [handleWheel]);

  const handleCanvasPointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement) === e.currentTarget || e.button === 1 || e.altKey) {
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY, tx: panRef.current.x, ty: panRef.current.y };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
  }, []);

  const handleCanvasPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    panRef.current = {
      x: panStart.current.tx + (e.clientX - panStart.current.x),
      y: panStart.current.ty + (e.clientY - panStart.current.y),
    };
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(applyTransform);
  }, [applyTransform]);

  const handleCanvasPointerUp = useCallback((e: React.PointerEvent) => {
    isPanning.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  // Blueprint drag
  const bpDragData = useRef({ dragging: false, startX: 0, startY: 0, startOX: 0, startOY: 0 });
  const handleBpPointerDown = (e: React.PointerEvent) => {
    if (locked) return;
    e.stopPropagation();
    bpDragData.current = { dragging: true, startX: e.clientX, startY: e.clientY, startOX: bpOffsetX, startOY: bpOffsetY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handleBpPointerMove = (e: React.PointerEvent) => {
    if (!bpDragData.current.dragging) return;
    const { startX, startY, startOX, startOY } = bpDragData.current;
    setBlueprintConfig({ offsetX: startOX + (e.clientX - startX) / scaleRef.current, offsetY: startOY + (e.clientY - startY) / scaleRef.current });
  };
  const handleBpPointerUp = (e: React.PointerEvent) => {
    bpDragData.current.dragging = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const showBlueprint = view === 'original' || view === 'overlay';
  const showRooms = view === 'overlay' || view === 'clean';
  const blueprintOpacityFinal = view === 'overlay' ? Math.min(opacity, 0.4) : opacity;

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden select-none"
      style={{ cursor: isPanning.current ? 'grabbing' : 'grab' }}
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handleCanvasPointerMove}
      onPointerUp={handleCanvasPointerUp}
      onPointerCancel={handleCanvasPointerUp}
      onClick={handleCanvasClick}
    >
      {/* Zoom buttons */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 z-30 pointer-events-auto">
        <button onClick={() => setZoom(scaleRef.current * 1.25)} className="w-7 h-7 bg-white border border-gray-200 rounded shadow-sm text-sm flex items-center justify-center hover:bg-gray-50 font-bold text-gray-700">+</button>
        <button onClick={() => { scaleRef.current = 1; panRef.current = { x: 0, y: 0 }; applyTransform(); }} className="w-7 h-7 bg-white border border-gray-200 rounded shadow-sm text-[10px] flex items-center justify-center hover:bg-gray-50 text-gray-700">1:1</button>
        <button onClick={() => setZoom(scaleRef.current / 1.25)} className="w-7 h-7 bg-white border border-gray-200 rounded shadow-sm text-sm flex items-center justify-center hover:bg-gray-50 font-bold text-gray-700">−</button>
        <button
          onClick={() => {
            // Fit all rooms into view
            const rooms = model.rooms;
            if (rooms.length === 0) { scaleRef.current = 1; panRef.current = { x: 0, y: 0 }; applyTransform(); return; }
            const minX = Math.min(...rooms.map(r => r.x)) * SCALE + OFFSET_X;
            const maxX = Math.max(...rooms.map(r => r.x + r.width)) * SCALE + OFFSET_X;
            const minY = Math.min(...rooms.map(r => r.y)) * SCALE + OFFSET_Y;
            const maxY = Math.max(...rooms.map(r => r.y + r.height)) * SCALE + OFFSET_Y;
            const container = containerRef.current;
            if (!container) return;
            const cw = container.clientWidth; const ch = container.clientHeight;
            const fw = maxX - minX; const fh = maxY - minY;
            const newScale = Math.min(0.9, Math.min(cw / (fw + 120), ch / (fh + 120)));
            scaleRef.current = newScale;
            panRef.current = { x: cw / 2 - (minX + fw / 2) * newScale, y: ch / 2 - (minY + fh / 2) * newScale };
            applyTransform();
          }}
          className="w-7 h-7 bg-white border border-gray-200 rounded shadow-sm text-[10px] flex items-center justify-center hover:bg-gray-50 text-gray-700"
          title="Fit to screen"
        >⊡</button>
      </div>

      {/* Canvas (single transformed div — no React state on pan/zoom) */}
      <div
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ transformOrigin: 'top left', willChange: 'transform' }}
      >
        {/* Blueprint image */}
        {blueprintUrl && showBlueprint && (
          <img
            src={blueprintUrl}
            alt="Blueprint"
            onPointerDown={handleBpPointerDown}
            onPointerMove={handleBpPointerMove}
            onPointerUp={handleBpPointerUp}
            onPointerCancel={handleBpPointerUp}
            draggable={false}
            className={`absolute select-none ${locked ? 'pointer-events-none' : 'cursor-move'}`}
            style={{
              left: OFFSET_X + bpOffsetX,
              top: OFFSET_Y + bpOffsetY,
              opacity: blueprintOpacityFinal,
              transformOrigin: 'top left',
              transform: `scale(${bpScale / SCALE}) rotate(${rotation}deg)`,
              maxWidth: 'none',
              imageRendering: 'auto',
            }}
          />
        )}

        {/* Rooms */}
        {showRooms && model.rooms.map(room => (
          <Room2D key={room.id} room={room} scale={SCALE} offsetX={OFFSET_X} offsetY={OFFSET_Y} containerRef={containerRef} />
        ))}

        {/* Variant preview ghost */}
        {showRooms && previewVariantModel && previewVariantModel.rooms.map(room => (
          <div
            key={`preview-${room.id}`}
            className="absolute border-2 border-blue-500 border-dashed bg-blue-500/10 pointer-events-none z-30"
            style={{ left: OFFSET_X + room.x * SCALE, top: OFFSET_Y + room.y * SCALE, width: room.width * SCALE, height: room.height * SCALE }}
          />
        ))}
      </div>

      
        {/* Calibration Markers */}
        {calibrationMode !== 'idle' && calibrationPt1 && (
          <div className="absolute w-3 h-3 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none" style={{ left: calibrationPt1.x, top: calibrationPt1.y }} />
        )}

      {/* Zoom % label */}
      <div ref={zoomDisplay} className="absolute bottom-3 right-3 bg-white border border-gray-200 rounded px-2 py-0.5 text-[10px] text-gray-500 shadow-sm pointer-events-none z-20">
        100%
      </div>
    </div>
  );
}
