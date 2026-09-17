const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "{rooms.length > 0 && (\n            <button",
  "{rooms.length > 0 && (\n            <>\n            <button"
);

content = content.replace(
  "Export 2D SVG\n            </button>\n\n          )}",
  "Export 2D SVG\n            </button>\n            </>\n          )}"
);

fs.writeFileSync('src/App.tsx', content);
