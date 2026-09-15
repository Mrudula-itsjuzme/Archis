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

  const semanticOverlay = useStore(state => state.semanticOverlay);

  const styling: Record<string, string> = {
    living: 'bg-white',
    kitchen: 'bg-gray-50',
    bedroom: 'bg-white',
    bathroom: 'bg-gray-50',
    circulation: 'bg-gray-50',
  };

  const getOverlayStyle = () => {
    if (semanticOverlay === 'privacy') {
      if (['bedroom', 'bathroom'].includes(room.type)) return 'bg-red-500/10'; // Private
      if (['living', 'kitchen'].includes(room.type)) return 'bg-amber-400/10'; // Semi
      return 'bg-emerald-500/10'; // Public
    }
    if (semanticOverlay === 'circulation') {
      if (room.type === 'circulation') return 'bg-blue-500/10';
      return 'bg-white opacity-90';
    }
    if (semanticOverlay === 'daylight') {
      if (['living', 'bedroom'].includes(room.type)) return 'bg-yellow-300/10';
      return 'bg-blue-900/5';
    }
    return styling[room.type] || styling.living;
  };
  
  const textStyling = 'text-gray-700';

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={() => setHoveredSpaceId(room.id)}
      onPointerLeave={() => setHoveredSpaceId(null)}
      className={`absolute border-[4px] flex flex-col cursor-move select-none transition-all overflow-hidden ${isSelected ? 'border-blue-500 bg-blue-50 shadow-xl z-20 ring-4 ring-blue-500/30' : isHovered ? 'border-blue-400 shadow-md z-10 bg-white' : `border-[#2c2c2c] shadow-sm z-10 ${getOverlayStyle()}`}`}
      style={{
        left: offsetX + room.x * scale,
        top: offsetY + room.y * scale,
        width: room.width * scale,
        height: room.height * scale,
      }}
    >
      <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 ${textStyling}`}>
        <span className="font-bold text-xs tracking-wide">{room.name}</span>
        <span className="text-[10px] font-mono mt-1 text-gray-500">
          {(room.width * room.height).toFixed(1)} m²
        </span>
      </div>

      {/* Furniture */}
      {roomFurniture.map(f => (
        <div 
          key={f.id}
          className="absolute border-[1.5px] border-gray-400 bg-white flex items-center justify-center pointer-events-none"
          style={{
            left: f.x * scale,
            top: f.y * scale,
            width: f.width * scale,
            height: f.depth * scale,
            transform: `rotate(${f.rotation}deg)`
          }}
        >
        </div>
      ))}
      
      {/* Resize Handle */}
      {!room.isLocked && (
        <div 
          onPointerDown={handleResizeDown}
          className="absolute right-0 bottom-0 w-3 h-3 border-t border-l border-gray-300 bg-white cursor-nwse-resize hover:bg-blue-100 transition-colors z-20" 
        />
      )}
    </div>
  );
}
