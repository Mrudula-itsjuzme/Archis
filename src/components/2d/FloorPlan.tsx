import { useRef, useState, useCallback, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import Room2D from './Room2D';

export default function FloorPlan() {
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

  const containerRef = useRef<HTMLDivElement>(null);

  // Canvas-level pan/zoom state
  const [canvasTranslate, setCanvasTranslate] = useState({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState(1);
  const panStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const isPanningCanvas = useRef(false);

  // 1 meter = 40 pixels (base scale for spaces)
  const SCALE = 40;
  const OFFSET_X = 60;
  const OFFSET_Y = 60;

  // Wheel to zoom the canvas
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setCanvasScale(prev => Math.min(4, Math.max(0.2, prev + delta * prev)));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Middle-click or space+drag to pan the canvas
  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    // Middle mouse button or space held
    if (e.button === 1 || e.altKey) {
      e.preventDefault();
      isPanningCanvas.current = true;
      panStart.current = { x: e.clientX, y: e.clientY, tx: canvasTranslate.x, ty: canvasTranslate.y };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      return;
    }
    // Also pan if clicking blank canvas (no room target)
    if ((e.target as HTMLElement) === e.currentTarget) {
      isPanningCanvas.current = true;
      panStart.current = { x: e.clientX, y: e.clientY, tx: canvasTranslate.x, ty: canvasTranslate.y };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (isPanningCanvas.current && panStart.current) {
      setCanvasTranslate({
        x: panStart.current.tx + (e.clientX - panStart.current.x),
        y: panStart.current.ty + (e.clientY - panStart.current.y),
      });
    }
  };

  const handleCanvasPointerUp = (e: React.PointerEvent) => {
    isPanningCanvas.current = false;
    panStart.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // Blueprint drag handlers (within the canvas transform)
  const handleBpPointerDown = (e: React.PointerEvent) => {
    if (locked) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    (e.currentTarget as HTMLElement).dataset.dragging = 'true';
    (e.currentTarget as HTMLElement).dataset.startX = e.clientX.toString();
    (e.currentTarget as HTMLElement).dataset.startY = e.clientY.toString();
    (e.currentTarget as HTMLElement).dataset.startOffsetX = bpOffsetX.toString();
    (e.currentTarget as HTMLElement).dataset.startOffsetY = bpOffsetY.toString();
    e.stopPropagation();
  };

  const handleBpPointerMove = (e: React.PointerEvent) => {
    if ((e.currentTarget as HTMLElement).dataset.dragging === 'true') {
      const startX = parseFloat((e.currentTarget as HTMLElement).dataset.startX || '0');
      const startY = parseFloat((e.currentTarget as HTMLElement).dataset.startY || '0');
      const startOffsetX = parseFloat((e.currentTarget as HTMLElement).dataset.startOffsetX || '0');
      const startOffsetY = parseFloat((e.currentTarget as HTMLElement).dataset.startOffsetY || '0');
      setBlueprintConfig({ offsetX: startOffsetX + (e.clientX - startX) / canvasScale, offsetY: startOffsetY + (e.clientY - startY) / canvasScale });
    }
  };

  const handleBpPointerUp = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).dataset.dragging = 'false';
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handleCanvasPointerMove}
      onPointerUp={handleCanvasPointerUp}
      onPointerCancel={handleCanvasPointerUp}
    >
      {/* Zoom/pan controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 z-30">
        <button onClick={() => setCanvasScale(s => Math.min(4, s * 1.2))} className="w-7 h-7 bg-white border border-gray-200 rounded shadow-sm text-sm flex items-center justify-center hover:bg-gray-50 font-bold">+</button>
        <button onClick={() => setCanvasScale(1)} className="w-7 h-7 bg-white border border-gray-200 rounded shadow-sm text-[10px] flex items-center justify-center hover:bg-gray-50">1:1</button>
        <button onClick={() => setCanvasScale(s => Math.max(0.2, s / 1.2))} className="w-7 h-7 bg-white border border-gray-200 rounded shadow-sm text-sm flex items-center justify-center hover:bg-gray-50 font-bold">−</button>
        <button onClick={() => { setCanvasScale(1); setCanvasTranslate({ x: 0, y: 0 }); }} className="w-7 h-7 bg-white border border-gray-200 rounded shadow-sm text-[10px] flex items-center justify-center hover:bg-gray-50">⊡</button>
      </div>

      {/* The zoomable/pannable canvas */}
      <div
        style={{
          transform: `translate(${canvasTranslate.x}px, ${canvasTranslate.y}px) scale(${canvasScale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {/* Blueprint background */}
        {blueprintUrl && (
          <img
            src={blueprintUrl}
            alt="Blueprint"
            onPointerDown={handleBpPointerDown}
            onPointerMove={handleBpPointerMove}
            onPointerUp={handleBpPointerUp}
            onPointerCancel={handleBpPointerUp}
            className={`absolute select-none ${locked ? 'pointer-events-none opacity-40' : 'cursor-move hover:opacity-100'}`}
            draggable={false}
            style={{
              left: OFFSET_X + bpOffsetX,
              top: OFFSET_Y + bpOffsetY,
              opacity,
              transformOrigin: 'top left',
              transform: `scale(${bpScale / SCALE}) rotate(${rotation}deg)`,
              maxWidth: 'none',
            }}
          />
        )}

        {/* Rooms */}
        {model.rooms.map(room => (
          <Room2D
            key={room.id}
            room={room}
            scale={SCALE}
            offsetX={OFFSET_X}
            offsetY={OFFSET_Y}
            containerRef={containerRef}
          />
        ))}

        {/* Variant Preview */}
        {previewVariantModel && previewVariantModel.rooms.map(room => (
          <div
            key={`preview-${room.id}`}
            className="absolute border-2 border-blue-500 border-dashed bg-blue-500/10 pointer-events-none z-30"
            style={{
              left: OFFSET_X + room.x * SCALE,
              top: OFFSET_Y + room.y * SCALE,
              width: room.width * SCALE,
              height: room.height * SCALE,
            }}
          />
        ))}
      </div>

      {/* Zoom level indicator */}
      <div className="absolute bottom-3 right-3 bg-white border border-gray-200 rounded px-2 py-1 text-[10px] text-gray-500 shadow-sm pointer-events-none z-20">
        {Math.round(canvasScale * 100)}%
      </div>
    </div>
  );
}
