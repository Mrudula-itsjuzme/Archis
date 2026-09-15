import { useRef } from 'react';
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
  
  const containerRef = useRef<HTMLDivElement>(null);

  // 1 meter = 40 pixels (base scale for spaces)
  const SCALE = 40; 
  const OFFSET_X = 100;
  const OFFSET_Y = 100;

  return (
    <div className="w-full h-full relative overflow-hidden" ref={containerRef}>
      {/* Optional Blueprint Background */}
      {blueprintUrl && (
        <img 
          src={blueprintUrl} 
          alt="Blueprint" 
          className={`absolute ${locked ? 'pointer-events-none' : ''} cursor-move`}
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
    </div>
  );
}
