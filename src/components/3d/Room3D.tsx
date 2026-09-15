import React, { useRef } from 'react';
import { Room } from '../../models/types';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';
import { TransformControls, Html, Edges } from '@react-three/drei';
import { useStore } from '../../store/useStore';

interface Room3DProps {
  room: Room;
  isFirstPerson: boolean;
}

function DeterministicFurniture({ roomType, w, d }: { roomType: string, w: number, d: number }) {
  // Common materials
  const woodMaterial = new THREE.MeshStandardMaterial({ color: '#c2a588', roughness: 0.8 });
  const fabricMaterial = new THREE.MeshStandardMaterial({ color: '#e0e0e0', roughness: 0.9 });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: '#4a4a4a', roughness: 0.5 });
  const whiteMaterial = new THREE.MeshStandardMaterial({ color: '#f5f5f5', roughness: 0.2 });

  if (roomType === 'bedroom') {
    // Bed
    if (w > 2.5 && d > 2.5) {
      return (
        <group position={[0, 0, -d/2 + 1.2]}>
          {/* Base */}
          <mesh castShadow receiveShadow position={[0, 0.15, 0]} material={woodMaterial}>
            <boxGeometry args={[1.6, 0.3, 2.0]} />
          </mesh>
          {/* Mattress */}
          <mesh castShadow receiveShadow position={[0, 0.4, 0]} material={whiteMaterial}>
            <boxGeometry args={[1.5, 0.2, 1.9]} />
          </mesh>
          {/* Pillows */}
          <mesh castShadow receiveShadow position={[-0.4, 0.55, -0.7]} material={fabricMaterial}>
            <boxGeometry args={[0.5, 0.1, 0.3]} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.4, 0.55, -0.7]} material={fabricMaterial}>
            <boxGeometry args={[0.5, 0.1, 0.3]} />
          </mesh>
        </group>
      );
    }
  }

  if (roomType === 'living') {
    // Sofa and coffee table
    if (w > 3 && d > 3) {
      return (
        <group position={[0, 0, 0]}>
          {/* Sofa Base */}
          <mesh castShadow receiveShadow position={[0, 0.2, d/2 - 0.8]} material={fabricMaterial}>
            <boxGeometry args={[2.0, 0.4, 0.8]} />
          </mesh>
          {/* Sofa Back */}
          <mesh castShadow receiveShadow position={[0, 0.6, d/2 - 0.5]} material={fabricMaterial}>
            <boxGeometry args={[2.0, 0.4, 0.2]} />
          </mesh>
          {/* Coffee Table */}
          <mesh castShadow receiveShadow position={[0, 0.25, d/2 - 1.6]} material={woodMaterial}>
            <boxGeometry args={[1.0, 0.05, 0.6]} />
          </mesh>
          {/* Table Legs */}
          <mesh castShadow receiveShadow position={[-0.45, 0.125, d/2 - 1.85]} material={darkMaterial}>
            <boxGeometry args={[0.05, 0.25, 0.05]} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.45, 0.125, d/2 - 1.85]} material={darkMaterial}>
            <boxGeometry args={[0.05, 0.25, 0.05]} />
          </mesh>
          <mesh castShadow receiveShadow position={[-0.45, 0.125, d/2 - 1.35]} material={darkMaterial}>
            <boxGeometry args={[0.05, 0.25, 0.05]} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.45, 0.125, d/2 - 1.35]} material={darkMaterial}>
            <boxGeometry args={[0.05, 0.25, 0.05]} />
          </mesh>
        </group>
      );
    }
  }

  if (roomType === 'kitchen' || roomType === 'dining') {
    if (w > 2 && d > 2) {
      return (
        <group position={[0, 0, 0]}>
          {/* Kitchen Island / Dining Table */}
          <mesh castShadow receiveShadow position={[0, 0.85, 0]} material={whiteMaterial}>
            <boxGeometry args={[1.8, 0.05, 0.8]} />
          </mesh>
          {/* Base */}
          <mesh castShadow receiveShadow position={[0, 0.4, 0]} material={darkMaterial}>
            <boxGeometry args={[1.4, 0.8, 0.4]} />
          </mesh>
        </group>
      );
    }
  }

  if (roomType === 'bathroom') {
    return (
      <group position={[0, 0, -d/2 + 0.5]}>
        {/* Toilet / Basin area massing */}
        <mesh castShadow receiveShadow position={[-w/2 + 0.4, 0.45, 0]} material={whiteMaterial}>
          <boxGeometry args={[0.6, 0.9, 0.5]} />
        </mesh>
        <mesh castShadow receiveShadow position={[w/2 - 0.5, 1.0, 0]} material={whiteMaterial}>
          <boxGeometry args={[0.8, 2.0, 0.8]} />
        </mesh>
      </group>
    );
  }

  return null; // Empty circulation or too small
}

export default function Room3D({ room, isFirstPerson }: Room3DProps) {
  const WALL_HEIGHT = 2.8; 
  const T = 0.15; // Wall thickness
  const updateSpacePosition = useStore((state) => state.updateSpacePosition);
  const isSelected = useStore(state => state.selectedSpaceId === room.id);
  const isHovered = useStore(state => state.hoveredSpaceId === room.id);
  const setSelectedSpaceId = useStore(state => state.setSelectedSpaceId);
  const setHoveredSpaceId = useStore(state => state.setHoveredSpaceId);
  const groupRef = useRef<THREE.Group>(null as any);
  
  const w = room.width;
  const d = room.height;

  const handlePointerDown = (e: any) => {
    if (isFirstPerson) return;
    e.stopPropagation();
    setSelectedSpaceId(isSelected ? null : room.id);
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHoveredSpaceId(room.id);
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHoveredSpaceId(null);
  };

  const isHighlighted = isSelected || isHovered;

  // Architectural neutral palette
  const wallColor = '#2c2c2c';
  
  const floorColors: Record<string, string> = { living: "#d6c6b3", bedroom: "#d6c6b3", kitchen: "#e8e8e8", bathroom: "#e8e8e8", circulation: "#f0f0f0" };
  const semanticOverlay = useStore(state => state.semanticOverlay);

  const getOverlayColor = () => {
    if (semanticOverlay === 'privacy') {
      if (['bedroom', 'bathroom'].includes(room.type)) return '#ef4444'; // red-500
      if (['living', 'kitchen'].includes(room.type)) return '#fbbf24'; // amber-400
      return '#10b981'; // emerald-500
    }
    if (semanticOverlay === 'circulation') {
      if (room.type === 'circulation') return '#3b82f6'; // blue-500
      return '#e5e7eb'; // gray-200
    }
    if (semanticOverlay === 'daylight') {
      if (['living', 'bedroom'].includes(room.type)) return '#fde047'; // yellow-300
      return '#1e3a8a'; // blue-900
    }
    return floorColors[room.type] || '#f0f0f0';
  };
  
  const baseColor = getOverlayColor();
  const floorColor = isSelected ? '#b8c9e6' : baseColor;

  const groupContent = (
    <group 
      ref={groupRef} 
      position={[room.x + w / 2, 0, room.y + d / 2]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <RigidBody type="fixed" friction={1}>
        <mesh receiveShadow position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} onPointerDown={handlePointerDown}>
          <planeGeometry args={[w, d]} />
          <meshStandardMaterial color={floorColor} roughness={0.9} />
          {isHighlighted && (
            <Edges scale={1.0} threshold={15} color="#3b5998" />
          )}
        </mesh>
      </RigidBody>

      {/* Deterministic Furniture */}
      <DeterministicFurniture roomType={room.type} w={w} d={d} />

      {/* Walls */}
      <RigidBody type="fixed" friction={0.5}>
        <mesh castShadow receiveShadow position={[0, WALL_HEIGHT / 2, -d / 2 + T / 2]} onPointerDown={handlePointerDown}>
          <boxGeometry args={[w, WALL_HEIGHT, T]} />
          <meshStandardMaterial color={wallColor} roughness={1} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, WALL_HEIGHT / 2, d / 2 - T / 2]} onPointerDown={handlePointerDown}>
          <boxGeometry args={[w, WALL_HEIGHT, T]} />
          <meshStandardMaterial color={wallColor} roughness={1} />
        </mesh>
        <mesh castShadow receiveShadow position={[-w / 2 + T / 2, WALL_HEIGHT / 2, 0]} onPointerDown={handlePointerDown}>
          <boxGeometry args={[T, WALL_HEIGHT, d - T * 2]} />
          <meshStandardMaterial color={wallColor} roughness={1} />
        </mesh>
        <mesh castShadow receiveShadow position={[w / 2 - T / 2, WALL_HEIGHT / 2, 0]} onPointerDown={handlePointerDown}>
          <boxGeometry args={[T, WALL_HEIGHT, d - T * 2]} />
          <meshStandardMaterial color={wallColor} roughness={1} />
        </mesh>
      </RigidBody>

      {/* Hover Labels */}
      {isHighlighted && !isFirstPerson && (
        <Html position={[0, WALL_HEIGHT + 0.5, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="bg-white/90 backdrop-blur-sm border border-black/10 px-3 py-2 rounded shadow-lg flex flex-col items-center">
            <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">{room.name}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mt-0.5">{room.type}</span>
            <span className="text-xs text-blue-600 font-mono mt-1">{(w * d).toFixed(1)} m²</span>
          </div>
        </Html>
      )}
    </group>
  );

  return (
    <>
      {isSelected && !isFirstPerson && !room.isLocked ? (
        <TransformControls
          object={groupRef}
          mode="translate"
          showY={false}
          onMouseUp={(e) => {
            if (groupRef.current) {
              const x = groupRef.current.position.x;
              const z = groupRef.current.position.z;
              const snappedX = Math.round((x - w / 2) * 2) / 2;
              const snappedY = Math.round((z - d / 2) * 2) / 2;
              updateSpacePosition(room.id, snappedX, snappedY);
            }
          }}
        />
      ) : null}
      {groupContent}
    </>
  );
}
