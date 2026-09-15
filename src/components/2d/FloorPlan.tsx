import { useRef } from 'react';
import { useStore } from '../../store/useStore';
import Room2D from './Room2D';
import PlanViewToggle from './PlanViewToggle';

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
  
  const containerRef = useRef<HTMLDivElement>(null);

  // 1 meter = 40 pixels (base scale for spaces)
  const SCALE = 40; 
  const OFFSET_X = 100;
  const OFFSET_Y = 100;

  const setBlueprintConfig = useStore(state => state.setBlueprintConfig);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (locked) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    // Store starting positions in data attributes for simple drag tracking without state overhead
    (e.currentTarget as HTMLImageElement).dataset.dragging = 'true';
    (e.currentTarget as HTMLImageElement).dataset.startX = e.clientX.toString();
    (e.currentTarget as HTMLImageElement).dataset.startY = e.clientY.toString();
    (e.currentTarget as HTMLImageElement).dataset.startOffsetX = bpOffsetX.toString();
    (e.currentTarget as HTMLImageElement).dataset.startOffsetY = bpOffsetY.toString();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if ((e.currentTarget as HTMLImageElement).dataset.dragging === 'true') {
      const startX = parseFloat((e.currentTarget as HTMLImageElement).dataset.startX || '0');
      const startY = parseFloat((e.currentTarget as HTMLImageElement).dataset.startY || '0');
      const startOffsetX = parseFloat((e.currentTarget as HTMLImageElement).dataset.startOffsetX || '0');
      const startOffsetY = parseFloat((e.currentTarget as HTMLImageElement).dataset.startOffsetY || '0');
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      setBlueprintConfig({ offsetX: startOffsetX + dx, offsetY: startOffsetY + dy });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLImageElement).dataset.dragging = 'false';
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="w-full h-full relative overflow-hidden" ref={containerRef}>
      {/* Optional Blueprint Background */}
      {blueprintUrl && (
        <img 
          src={blueprintUrl} 
          alt="Blueprint" 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`absolute ${locked ? 'pointer-events-none opacity-50' : 'cursor-move hover:opacity-100'} select-none shadow-sm`}
          draggable={false}
          style={{
            left: OFFSET_X + bpOffsetX,
            top: OFFSET_Y + bpOffsetY,
            opacity: opacity,
            transformOrigin: 'top left',
            transform: `scale(${bpScale / SCALE}) rotate(${rotation}deg)` 
          }}
        />
      )}

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

      {/* Variant Previews */}
      {previewVariantModel && previewVariantModel.rooms.map(room => (
        <div
          key={`preview-${room.id}`}
          className="absolute border-2 border-blue-500 border-dashed bg-blue-500/10 pointer-events-none z-30 transition-all duration-300"
          style={{
            left: OFFSET_X + room.x * SCALE,
            top: OFFSET_Y + room.y * SCALE,
            width: room.width * SCALE,
            height: room.height * SCALE,
          }}
        />
      ))}
      <PlanViewToggle />
    </div>
  );
}
