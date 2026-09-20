const fs = require('fs');
let content = fs.readFileSync('src/components/3d/Scene3D.tsx', 'utf8');

if (!content.includes('import Exporter')) {
  content = content.replace(
    "import Room3D from './Room3D';",
    "import Room3D from './Room3D';\nimport Exporter from './Exporter';"
  );
}

if (!content.includes('<Exporter />')) {
  content = content.replace(
    "<Suspense fallback={null}>",
    "<Suspense fallback={null}>\n          <Exporter />"
  );
}

fs.writeFileSync('src/components/3d/Scene3D.tsx', content);
