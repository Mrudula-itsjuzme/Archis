import { useStore } from '../../store/useStore';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function BlueprintUnderlay3D({ centerX, centerY }: { centerX: number, centerY: number }) {
  const url = useStore(state => state.blueprintUrl);
  const opacity = useStore(state => state.blueprintOpacity);
  const scale = useStore(state => state.blueprintScale);
  const rotation = useStore(state => state.blueprintRotation);
  const offsetX = useStore(state => state.blueprintOffsetX);
  const offsetY = useStore(state => state.blueprintOffsetY);

  if (!url) return null;

  try {
    const texture = useLoader(THREE.TextureLoader, url);
    if (!texture) return null;
    
    texture.colorSpace = THREE.SRGBColorSpace;
    
    // In 2D, scale is pixels per meter (default 48).
    // In 3D, 1 unit = 1 meter.
    // The texture natural width in pixels divided by scale gives meters.
    const imgAspect = texture.image.width / texture.image.height;
    
    // Convert 2D offsets to 3D world space
    // Note: This math might need fine-tuning to exactly match 2D depending on the coordinate system mapping.
    // For now we map it generally to the center of the scene.
    
    const worldWidth = texture.image.width / scale;
    const worldHeight = texture.image.height / scale;

    const xPos = offsetX / scale;
    const yPos = offsetY / scale;

    return (
      <mesh 
        position={[xPos, -0.05, yPos]} 
        rotation={[-Math.PI / 2, 0, (rotation * Math.PI) / 180]}
      >
        <planeGeometry args={[worldWidth, worldHeight]} />
        <meshBasicMaterial 
          map={texture} 
          transparent 
          opacity={opacity} 
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    );
  } catch (e) {
    return null;
  }
}
