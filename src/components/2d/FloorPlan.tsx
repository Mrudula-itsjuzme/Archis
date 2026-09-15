import React, { useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Room } from '../../models/types';
import Room2D from './Room2D';

const SCALE = 40; // 1 meter = 40 pixels
const OFFSET_X = 100;
const OFFSET_Y = 100;

export default function FloorPlan() {
  const model = useStore(state => state.model);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ touchAction: 'none' }}>
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
    </div>
  );
}
