import { useState, useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Grid, PointerLockControls, OrbitControls, KeyboardControls } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
// @ts-ignore
import { Ecctrl } from 'ecctrl';
import { useStore } from '../../store/useStore';
import Room3D from './Room3D';

function CameraRig({ view, centerX, centerY, size }: { view: string, centerX: number, centerY: number, size: number }) {
  const { camera } = useThree();
  const target = new THREE.Vector3(0, 0, 0);

  useEffect(() => {
    // Sane padding based on project size
    const distance = Math.max(25, size * 1.2);
    
    if (view === 'top') {
      camera.position.set(0, distance * 1.5, 0);
    } else {
      // Iso view
      camera.position.set(-distance * 0.8, distance, distance * 0.8);
    }
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }, [view, camera, centerX, centerY, size]);

  return null;
}

export default function Scene3D() {
  const model = useStore(state => state.model);
  const [isFirstPerson, setIsFirstPerson] = useState(false);
  const [cameraView, setCameraView] = useState<'perspective' | 'top'>('perspective');

  let minX = 0, maxX = 0, minY = 0, maxY = 0;
  if (model.rooms.length > 0) {
    minX = Math.min(...model.rooms.map(r => r.x));
    maxX = Math.max(...model.rooms.map(r => r.x + r.width));
    minY = Math.min(...model.rooms.map(r => r.y));
    maxY = Math.max(...model.rooms.map(r => r.y + r.height));
  }
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const size = Math.max(maxX - minX, maxY - minY);

  const keyboardMap = useMemo(() => [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] },
    { name: 'run', keys: ['Shift'] },
  ], []);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button 
          onClick={() => { setIsFirstPerson(false); setCameraView('perspective'); }}
          className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border transition-colors ${!isFirstPerson && cameraView === 'perspective' ? 'bg-[#3b5998] text-white border-transparent' : 'bg-white/80 text-[#2c2c2c] border-black/10'}`}
        >
          Iso
        </button>
        <button 
          onClick={() => { setIsFirstPerson(false); setCameraView('top'); }}
          className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border transition-colors ${!isFirstPerson && cameraView === 'top' ? 'bg-[#3b5998] text-white border-transparent' : 'bg-white/80 text-[#2c2c2c] border-black/10'}`}
        >
          Top
        </button>
        <button 
          onClick={() => setIsFirstPerson(true)}
          className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border transition-colors ${isFirstPerson ? 'bg-[#3b5998] text-white border-transparent' : 'bg-white/80 text-[#2c2c2c] border-black/10'}`}
        >
          Walk (WASD)
        </button>
      </div>

      <KeyboardControls map={keyboardMap}>
        <Canvas shadows camera={{ position: [centerX - 15, 25, centerY + 15], fov: 40 }}>
          {!isFirstPerson && <CameraRig view={cameraView} centerX={centerX} centerY={centerY} size={size} />}
          <color attach="background" args={['#efedea']} />
          <hemisphereLight intensity={0.6} groundColor="#d4d4d4" />
          <ambientLight intensity={0.4} />
          <directionalLight 
            castShadow 
            position={[10, 30, 20]} 
            intensity={1.2} 
            shadow-mapSize={[2048, 2048]} 
            shadow-bias={-0.0005}
          />
          
          <Physics>
            <group position={[-centerX, 0, -centerY]}>
              {model.rooms.map(room => (
                <Room3D key={room.id} room={room} isFirstPerson={isFirstPerson} />
              ))}
              
              {/* Ground Plane for Physics */}
              <RigidBody type="fixed" friction={1}>
                <mesh receiveShadow position={[centerX, -0.1, centerY]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[100, 100]} />
                  <meshStandardMaterial color="#efedea" />
                </mesh>
              </RigidBody>
              
              <Grid 
                infiniteGrid 
                fadeDistance={50} 
                sectionColor="#2c2c2c" 
                cellColor="#2c2c2c" 
                position={[centerX, -0.05, centerY]} 
              />
              
              {isFirstPerson && (
                <Ecctrl 
                  
                  
                  position={[centerX, 2, centerY]} 
                >
                  <mesh castShadow position={[0, -0.5, 0]}>
                    <capsuleGeometry args={[0.3, 1, 4, 16]} />
                    <meshStandardMaterial color="#3b5998" />
                  </mesh>
                </Ecctrl>
              )}
            </group>
          </Physics>

          {isFirstPerson ? (
            <PointerLockControls />
          ) : (
            <OrbitControls makeDefault target={[0, 0, 0]} maxPolarAngle={Math.PI / 2 - 0.05} minPolarAngle={0.1} />
          )}
          <Environment preset="city" />
        </Canvas>
      </KeyboardControls>
      
      {isFirstPerson && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
          <div className="w-1.5 h-1.5 bg-white/80 mix-blend-difference rounded-full"></div>
          <div className="absolute bottom-4 left-4 bg-black/50 text-white text-[10px] font-mono px-3 py-2 rounded">
            Click to look around. Press ESC to release pointer. WASD to move.
          </div>
        </div>
      )}
    </div>
  );
}
