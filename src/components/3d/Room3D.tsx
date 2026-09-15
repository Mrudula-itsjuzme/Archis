import React, { useState, useRef } from 'react';
import { Room } from '../../models/types';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';
import { TransformControls } from '@react-three/drei';
import { useStore } from '../../store/useStore';

interface Room3DProps {
  room: Room;
  isFirstPerson: boolean;
}

export default function Room3D({ room, isFirstPerson }: Room3DProps) {
  const WALL_HEIGHT = 2.8; 
  const T = 0.1;
  const updateSpacePosition = useStore((state) => state.updateSpacePosition);
  const model = useStore(state => state.model);
  const isSelected = useStore(state => state.selectedSpaceId === room.id);
  const isHovered = useStore(state => state.hoveredSpaceId === room.id);
  const setSelectedSpaceId = useStore(state => state.setSelectedSpaceId);
  const setHoveredSpaceId = useStore(state => state.setHoveredSpaceId);
  const groupRef = useRef<THREE.Group>(null as any);
  
  const roomFurniture = model.furniture?.filter(f => f.spaceId === room.id) || [];

  const colors: Record<string, string> = {
    living: '#f4ede4',
    kitchen: '#f4f1db',
    bedroom: '#e3ebf3',
    bathroom: '#e0f0ed',
    circulation: '#f7f7f7',
  };
  
  const edgeColors: Record<string, string> = {
    living: '#d98b55',
    kitchen: '#d9bc55',
    bedroom: '#558fd9',
    bathroom: '#55d9be',
    circulation: '#cccccc',
  }

  const wallColor = colors[room.type];
  const edgeColor = edgeColors[room.type];
  const floorColor = '#ffffff';

  const w = room.width;
  const d = room.height;
  const COLLIDER_HEIGHT = 0.5;

  const handlePointerDown = (e: any) => {
    if (isFirstPerson) return;
    e.stopPropagation();
    setSelectedSpaceId(isSelected ? null : room.id);
  };

  const getFurnitureHeight = (type: string) => {
    switch (type) {
      case 'bed': return 0.5;
      case 'table': return 0.75;
      case 'counter': return 0.9;
      case 'sofa': return 0.6;
      default: return 0.5;
    }
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHoveredSpaceId(room.id);
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHoveredSpaceId(null);
  };

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
          <meshStandardMaterial color={floorColor} />
        </mesh>
      </RigidBody>

      {/* Furniture */}
      {roomFurniture.map(f => {
        const fh = getFurnitureHeight(f.type);
        // Position relative to room center
        const fx = f.x - w / 2 + f.width / 2;
        const fz = f.y - d / 2 + f.depth / 2;
        
        return (
          <RigidBody key={f.id} type="fixed" position={[fx, fh / 2, fz]}>
            <mesh castShadow receiveShadow rotation={[0, -f.rotation * Math.PI / 180, 0]}>
              <boxGeometry args={[f.width, fh, f.depth]} />
              <meshStandardMaterial color="#d1d1d1" roughness={0.7} />
            </mesh>
            <lineSegments rotation={[0, -f.rotation * Math.PI / 180, 0]}>
              <edgesGeometry args={[new THREE.BoxGeometry(f.width, fh, f.depth)]} />
              <lineBasicMaterial color="#a0a0a0" opacity={0.8} transparent />
            </lineSegments>
          </RigidBody>
        );
      })}

      <RigidBody type="fixed" friction={0.5}>
        <mesh position={[0, COLLIDER_HEIGHT / 2, -d / 2 + T / 2]}>
          <boxGeometry args={[w, COLLIDER_HEIGHT, T]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        <mesh position={[0, COLLIDER_HEIGHT / 2, d / 2 - T / 2]}>
          <boxGeometry args={[w, COLLIDER_HEIGHT, T]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        <mesh position={[-w / 2 + T / 2, COLLIDER_HEIGHT / 2, 0]}>
          <boxGeometry args={[T, COLLIDER_HEIGHT, d - T * 2]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        <mesh position={[w / 2 - T / 2, COLLIDER_HEIGHT / 2, 0]}>
          <boxGeometry args={[T, COLLIDER_HEIGHT, d - T * 2]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </RigidBody>

      <mesh castShadow receiveShadow position={[0, WALL_HEIGHT / 2, -d / 2 + T / 2]} onPointerDown={handlePointerDown}>
        <boxGeometry args={[w, WALL_HEIGHT, T]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, WALL_HEIGHT / 2, d / 2 - T / 2]} onPointerDown={handlePointerDown}>
        <boxGeometry args={[w, WALL_HEIGHT, T]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[-w / 2 + T / 2, WALL_HEIGHT / 2, 0]} onPointerDown={handlePointerDown}>
        <boxGeometry args={[T, WALL_HEIGHT, d - T * 2]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[w / 2 - T / 2, WALL_HEIGHT / 2, 0]} onPointerDown={handlePointerDown}>
        <boxGeometry args={[T, WALL_HEIGHT, d - T * 2]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.8} />
      </mesh>

      <lineSegments position={[0, WALL_HEIGHT / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(w, WALL_HEIGHT, d)]} />
        <lineBasicMaterial color={edgeColor} opacity={0.6} transparent />
      </lineSegments>
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
