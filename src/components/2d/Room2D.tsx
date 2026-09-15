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

export default function Room2D({ room, scale, offsetX, offsetY, containerRef }: Room2DProps) {
  const updateRoomPosition = useStore(state => state.updateRoomPosition);
  const updateRoomDimensions = useStore(state => state.updateRoomDimensions);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (room.isLocked) return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      const dx = e.movementX / scale;
      const dy = e.movementY / scale;
      updateRoomPosition(room.id, room.x + dx, room.y + dy);
    } else if (isResizing) {
      const dw = e.movementX / scale;
      const dh = e.movementY / scale;
      updateRoomDimensions(room.id, Math.max(1, room.width + dw), Math.max(1, room.height + dh));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
      const snappedX = Math.round(room.x * 2) / 2;
      const snappedY = Math.round(room.y * 2) / 2;
      updateRoomPosition(room.id, snappedX, snappedY);
    } else if (isResizing) {
      setIsResizing(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
      const snappedW = Math.round(room.width * 2) / 2;
      const snappedH = Math.round(room.height * 2) / 2;
      updateRoomDimensions(room.id, snappedW, snappedH);
    }
  };

  const handleResizeDown = (e: React.PointerEvent) => {
    if (room.isLocked) return;
    setIsResizing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
  };

  // Aesthetic colors mimicking architectural programs
  const styling = {
    living: 'bg-[#fffdfa]/80 border-orange-700/20 text-orange-900/60',
    kitchen: 'bg-[#fffdfa]/80 border-yellow-700/20 text-yellow-900/60',
    bedroom: 'bg-[#fffdfa]/80 border-blue-700/20 text-blue-900/60',
    bathroom: 'bg-[#fffdfa]/80 border-teal-700/20 text-teal-900/60',
    circulation: 'bg-[#fdfdfc]/80 border-[#2c2c2c]/10 text-[#2c2c2c]/50',
  };
  
  const accentColors = {
    living: 'bg-orange-600/40',
    kitchen: 'bg-yellow-600/40',
    bedroom: 'bg-blue-600/40',
    bathroom: 'bg-teal-600/40',
    circulation: 'bg-[#2c2c2c]/10',
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`absolute border flex items-center justify-center cursor-move select-none transition-shadow backdrop-blur-sm ${styling[room.type]} ${isDragging || isResizing ? 'shadow-xl z-20 opacity-100 ring-1 ring-black/5' : 'shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-10 hover:shadow-md hover:border-black/20'}`}
      style={{
        left: offsetX + room.x * scale,
        top: offsetY + room.y * scale,
        width: room.width * scale,
        height: room.height * scale,
      }}
    >
      {/* Type accent bar */}
      <div className={`absolute top-0 left-0 w-full h-[3px] ${accentColors[room.type]}`} />

      <div className="text-center pointer-events-none flex flex-col items-center">
        <span className="font-medium text-xs tracking-wide">{room.name}</span>
        <span className="text-[9px] font-mono mt-1 opacity-70">
          {room.width.toFixed(1)} &times; {room.height.toFixed(1)} m
        </span>
        <span className="text-[9px] font-mono mt-0.5 opacity-50">
          {(room.width * room.height).toFixed(1)} m²
        </span>
      </div>
      
      {/* Resize Handle */}
      {!room.isLocked && (
        <div 
          onPointerDown={handleResizeDown}
          className="absolute right-0 bottom-0 w-3 h-3 border-t border-l border-black/10 bg-black/5 cursor-nwse-resize hover:bg-black/10 transition-colors" 
        />
      )}
    </div>
  );
}
