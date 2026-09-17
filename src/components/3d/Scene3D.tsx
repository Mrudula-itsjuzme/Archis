import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import Room3D from './Room3D';
import Exporter from './Exporter';

function CameraRig({ centerX, centerY, size, view }: { centerX: number; centerY: number; size: number; view: string }) {
  const { camera } = useThree();
  useEffect(() => {
    const d = Math.max(20, size * 1.1);
    if (view === 'top') {
      camera.position.set(0, d * 1.8, 0);
    } else {
      camera.position.set(-d * 0.7, d * 0.9, d * 0.7);
    }
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [view, camera, size]);
  return null;
}

function SceneContent({ cameraView }: { cameraView: string }) {
  const model = useStore(state => state.model);
  const isDragging = useStore(state => state.isDragging3D);
  
  const rooms = model.rooms;
  const centerX = rooms.length > 0 ? rooms.reduce((s, r) => s + r.x + r.width / 2, 0) / rooms.length : 0;
  const centerY = rooms.length > 0 ? rooms.reduce((s, r) => s + r.y + r.height / 2, 0) / rooms.length : 0;
  const maxDim = rooms.length > 0
    ? Math.max(...rooms.map(r => Math.max(r.x + r.width, r.y + r.height)))
    : 20;

  return (
    <>
      <CameraRig centerX={centerX} centerY={centerY} size={maxDim} view={cameraView} />
      <OrbitControls makeDefault enabled={!isDragging} maxPolarAngle={Math.PI / 2 - 0.05} minPolarAngle={0.05} />
      <color attach="background" args={['#e8eaed']} />
      <ambientLight intensity={0.7} />
      <hemisphereLight intensity={0.4} groundColor="#ccc" />
      <directionalLight castShadow position={[10, 30, 20]} intensity={1.0} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0005} />
      
      <group position={[-centerX, 0, -centerY]}>
        {rooms.map(room => (
          <Room3D key={room.id} room={room} isFirstPerson={false} />
        ))}
        {/* Ground */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[centerX, -0.05, centerY]}>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#dde0e4" />
        </mesh>
        <Grid infiniteGrid fadeDistance={60} sectionColor="#aaa" cellColor="#ccc" position={[centerX, 0, centerY]} />
      </group>
    </>
  );
}

export default function Scene3D() {
  const [cameraView, setCameraView] = useState<'perspective' | 'top'>('perspective');
  const model = useStore(state => state.model);

  if (model.rooms.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-400">
        <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
        </svg>
        <div className="text-xs text-center">
          <div className="font-medium">3D model will appear here</div>
          <div className="text-gray-300 mt-1">Upload and analyze a blueprint first</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Camera controls top-right */}
      <div className="absolute top-3 right-3 z-20 flex gap-1.5">
        {(['perspective', 'top'] as const).map(v => (
          <button
            key={v}
            onClick={() => setCameraView(v)}
            className={`px-2.5 py-1 text-[10px] font-semibold rounded border transition-colors ${cameraView === v ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
          >
            {v === 'perspective' ? 'Isometric' : 'Top-down'}
          </button>
        ))}
      </div>

      <Canvas shadows camera={{ fov: 40 }} frameloop="demand">
        <Suspense fallback={null}>
          <Exporter />
          <SceneContent cameraView={cameraView} />
        </Suspense>
      </Canvas>
    </div>
  );
}
