const fs = require('fs');
const file = 'src/store/useStore.ts';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(
  "let apiKey = localStorage.getItem('GEMINI_API_KEY') || '';",
  "let apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || '';"
);
code = code.replace(
  "if (isDataUrl) {",
  "if (isDataUrl && !import.meta.env.VITE_GEMINI_API_KEY) {"
);
fs.writeFileSync(file, code);
