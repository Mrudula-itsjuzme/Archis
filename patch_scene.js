const fs = require('fs');
let code = fs.readFileSync('src/components/3d/Scene3D.tsx', 'utf8');

code = code.replace(
  'function CameraRig',
  `const SceneControls = () => {
  const isDragging3D = useStore(state => state.isDragging3D);
  return <OrbitControls makeDefault enabled={!isDragging3D} target={[0, 0, 0]} maxPolarAngle={Math.PI / 2 - 0.05} minPolarAngle={0.1} />;
};

function CameraRig`
);

code = code.replace(
  '<OrbitControls makeDefault enabled={!useStore(state => state.isDragging3D)}  target={[0, 0, 0]} maxPolarAngle={Math.PI / 2 - 0.05} minPolarAngle={0.1} />',
  '<SceneControls />'
);

fs.writeFileSync('src/components/3d/Scene3D.tsx', code);
