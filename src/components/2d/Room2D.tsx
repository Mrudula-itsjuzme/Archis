import React, { useState } from 'react';
import { Room } from '../../models/types';
import { useStore } from '../../store/useStore';

interface Room2DProps {
  room: Room & { shape?: 'rect' | 'arc' | 'l-shape'; radius?: number };
  scale: number;
  offsetX: number;
  offsetY: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

const TYPE_COLOR: Record<string, string> = {
  living: '#FFF9F0',
  kitchen: '#F0FFF4',
  bedroom: '#F0F4FF',
  bathroom: '#F0FAFA',
  circulation: '#FAFAFA',
  office: '#FFF0F5',
  classroom: '#FFFEF0',
  lab: '#F0F8FF',
  corridor: '#F9F9F9',
  courtyard: '#F0FFF0',
  stair: '#F5F0FF',
  retail: '#FFF5F0',
  utility: '#F5F5F5',
  lobby: '#FFF0FF',
  outdoor: '#F0FFF8',
};

export default function Room2D({ room, scale, offsetX, offsetY }: Room2DProps) {
  const updateSpacePosition = useStore(state => state.updateSpacePosition);
  const updateSpaceDimensions = useStore(state => state.updateSpaceDimensions);
  const semanticOverlay = useStore(state => state.semanticOverlay);
  const isStoreSelected = useStore(state => state.selectedSpaceId === room.id);
  const isStoreHovered = useStore(state => state.hoveredSpaceId === room.id);
  const setSelectedSpaceId = useStore(state => state.setSelectedSpaceId);
  const setHoveredSpaceId = useStore(state => state.setHoveredSpaceId);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const isSelected = isStoreSelected || isDragging || isResizing;
  const isHovered = isStoreHovered || isSelected;

  const isArc = (room as any).shape === 'arc';
  const w = room.width * scale;
  const h = room.height * scale;
  const l = offsetX + room.x * scale;
  const t = offsetY + room.y * scale;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (room.isLocked) return;
    setIsDragging(true);
    setSelectedSpaceId(room.id);
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateSpacePosition(room.id, room.x + e.movementX / scale, room.y + e.movementY / scale);
    } else if (isResizing) {
      updateSpaceDimensions(room.id, Math.max(1, room.width + e.movementX / scale), Math.max(1, room.height + e.movementY / scale));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
      updateSpacePosition(room.id, Math.round(room.x * 2) / 2, Math.round(room.y * 2) / 2);
    } else if (isResizing) {
      setIsResizing(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
      updateSpaceDimensions(room.id, Math.round(room.width * 2) / 2, Math.round(room.height * 2) / 2);
    }
  };

  const handleResizeDown = (e: React.PointerEvent) => {
    if (room.isLocked) return;
    setIsResizing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
  };

  const getOverlayColor = () => {
    if (semanticOverlay === 'privacy') {
      if (['bedroom', 'bathroom'].includes(room.type)) return 'rgba(239,68,68,0.08)';
      if (['living', 'kitchen'].includes(room.type)) return 'rgba(251,191,36,0.08)';
      return 'rgba(34,197,94,0.08)';
    }
    if (semanticOverlay === 'circulation') {
      return room.type === 'circulation' || room.type === 'corridor' ? 'rgba(59,130,246,0.10)' : 'rgba(255,255,255,0.95)';
    }
    if (semanticOverlay === 'daylight') {
      return ['living', 'bedroom', 'classroom'].includes(room.type) ? 'rgba(253,224,71,0.12)' : 'rgba(30,64,175,0.04)';
    }
    return TYPE_COLOR[room.type] || '#FFFFFF';
  };

  const borderColor = isSelected ? '#3B82F6' : isHovered ? '#60A5FA' : '#374151';
  const borderWidth = isSelected ? 3 : 2;
  const boxShadow = isSelected ? '0 0 0 4px rgba(59,130,246,0.2), 0 4px 20px rgba(0,0,0,0.12)' : isHovered ? '0 2px 8px rgba(0,0,0,0.08)' : 'none';
  const borderRadius = isArc ? '50% 50% 0 0' : '1px';

  const label = room.name;
  const area = (room.width * room.height).toFixed(1);

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={() => setHoveredSpaceId(room.id)}
      onPointerLeave={() => setHoveredSpaceId(null)}
      className="absolute cursor-move select-none"
      style={{
        left: l,
        top: t,
        width: w,
        height: h,
        backgroundColor: getOverlayColor(),
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius,
        boxShadow,
        zIndex: isSelected ? 20 : isHovered ? 10 : 1,
        transition: 'box-shadow 0.15s, border-color 0.15s',
        overflow: 'hidden',
      }}
    >
      {/* Room label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-semibold text-[11px] text-gray-700 text-center px-1 leading-tight">{label}</span>
        <span className="text-[10px] text-gray-400 mt-0.5">{area} m²</span>
        {isSelected && (
          <div className="text-[9px] text-gray-400 mt-1 font-mono">
            {room.width.toFixed(1)} × {room.height.toFixed(1)} m
          </div>
        )}
      </div>

      {/* Arc indicator */}
      {isArc && (
        <div className="absolute top-1 right-1 text-[8px] text-gray-400 bg-white/60 rounded px-1">arc</div>
      )}

      {/* Resize handle */}
      {!room.isLocked && (
        <div
          onPointerDown={handleResizeDown}
          className="absolute right-0 bottom-0 w-4 h-4 cursor-nwse-resize z-20"
          style={{
            background: 'linear-gradient(135deg, transparent 50%, rgba(100,116,139,0.4) 50%)',
          }}
        />
      )}
    </div>
  );
}
