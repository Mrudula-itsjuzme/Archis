import React, { useState } from 'react';
import { Room } from '../../models/types';
import { useStore } from '../../store/useStore';

interface Room2DProps {
  room: Room;
  scale: number;
  offsetX: number;
  offsetY: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function Room2D({ room, scale, offsetX, offsetY }: Room2DProps) {
  const updateSpacePosition = useStore(state => state.updateSpacePosition);
  const updateSpaceDimensions = useStore(state => state.updateSpaceDimensions);
  const model = useStore(state => state.model);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const isStoreSelected = useStore(state => state.selectedSpaceId === room.id);
  const isStoreHovered = useStore(state => state.hoveredSpaceId === room.id);
  const setSelectedSpaceId = useStore(state => state.setSelectedSpaceId);
  const setHoveredSpaceId = useStore(state => state.setHoveredSpaceId);

  const isSelected = isStoreSelected || isDragging || isResizing;
  const isHovered = isStoreHovered || isSelected;

  const roomFurniture = model.furniture?.filter(f => f.spaceId === room.id) || [];

  const handlePointerDown = (e: React.PointerEvent) => {
    if (room.isLocked) return;
    setIsDragging(true);
    setSelectedSpaceId(room.id);
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      const dx = e.movementX / scale;
      const dy = e.movementY / scale;
      updateSpacePosition(room.id, room.x + dx, room.y + dy);
    } else if (isResizing) {
      const dw = e.movementX / scale;
      const dh = e.movementY / scale;
      updateSpaceDimensions(room.id, Math.max(1, room.width + dw), Math.max(1, room.height + dh));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
      const snappedX = Math.round(room.x * 2) / 2;
      const snappedY = Math.round(room.y * 2) / 2;
      updateSpacePosition(room.id, snappedX, snappedY);
    } else if (isResizing) {
      setIsResizing(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
      const snappedW = Math.round(room.width * 2) / 2;
      const snappedH = Math.round(room.height * 2) / 2;
      updateSpaceDimensions(room.id, snappedW, snappedH);
    }
  };

  const handleResizeDown = (e: React.PointerEvent) => {
    if (room.isLocked) return;
    setIsResizing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
  };

  const styling: Record<string, string> = {
    living: 'bg-[#d6c6b3]',
    kitchen: 'bg-[#e8e8e8]',
    bedroom: 'bg-[#d6c6b3]',
    bathroom: 'bg-[#e8e8e8]',
    circulation: 'bg-[#f0f0f0]',
  };
  
  const textStyling = 'text-[#2c2c2c]/80';

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={() => setHoveredSpaceId(room.id)}
      onPointerLeave={() => setHoveredSpaceId(null)}
      className={`absolute border-[3px] flex flex-col cursor-move select-none transition-all overflow-hidden ${isSelected ? 'border-[#3b5998] bg-[#b8c9e6] shadow-xl z-20 ring-4 ring-blue-500/30' : isHovered ? 'border-[#3b5998] shadow-md z-10' : `border-[#2c2c2c] shadow-sm z-10 ${styling[room.type] || styling.living}`}`}
      style={{
        left: offsetX + room.x * scale,
        top: offsetY + room.y * scale,
        width: room.width * scale,
        height: room.height * scale,
      }}
    >
      <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 ${textStyling}`}>
        <span className="font-medium text-xs tracking-wide">{room.name}</span>
        <span className="text-[9px] font-mono mt-1 opacity-70">
          {room.width.toFixed(1)} &times; {room.height.toFixed(1)} m
        </span>
      </div>

      {/* Furniture */}
      {roomFurniture.map(f => (
        <div 
          key={f.id}
          className="absolute border border-black/20 bg-black/5 flex items-center justify-center pointer-events-none"
          style={{
            left: f.x * scale,
            top: f.y * scale,
            width: f.width * scale,
            height: f.depth * scale,
            transform: `rotate(${f.rotation}deg)`
          }}
        >
          <span className="text-[8px] font-mono opacity-50 uppercase">{f.type}</span>
        </div>
      ))}
      
      {/* Resize Handle */}
      {!room.isLocked && (
        <div 
          onPointerDown={handleResizeDown}
          className="absolute right-0 bottom-0 w-3 h-3 border-t border-l border-black/10 bg-black/5 cursor-nwse-resize hover:bg-black/10 transition-colors z-20" 
        />
      )}
    </div>
  );
}
