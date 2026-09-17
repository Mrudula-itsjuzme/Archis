import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { GLTFExporter } from 'three-stdlib';
import { useStore } from '../../store/useStore';

export default function Exporter() {
  const { scene } = useThree();
  const triggerExport = useStore(s => s.triggerExport3D);

  useEffect(() => {
    if (triggerExport) {
      const exporter = new GLTFExporter();
      exporter.parse(
        scene,
        (gltf: any) => {
          const output = JSON.stringify(gltf, null, 2);
          const blob = new Blob([output], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.download = 'archis_model.gltf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          useStore.getState().setTriggerExport3D(false);
        },
        (error: any) => {
          console.error('An error happened during parsing', error);
          useStore.getState().setTriggerExport3D(false);
        },
        { binary: false } // Export as .gltf (JSON) not .glb for wider debugging compatibility, though .glb is often preferred.
      );
    }
  }, [triggerExport, scene]);

  return null;
}
