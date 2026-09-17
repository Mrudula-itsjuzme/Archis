import { SemanticModel } from '../models/types';

export function downloadFloorPlanSVG(model: SemanticModel) {
  const rooms = model.rooms;
  if (rooms.length === 0) return;

  const minX = Math.min(...rooms.map(r => r.x)) - 2;
  const minY = Math.min(...rooms.map(r => r.y)) - 2;
  const maxX = Math.max(...rooms.map(r => r.x + r.width)) + 2;
  const maxY = Math.max(...rooms.map(r => r.y + r.height)) + 2;
  const width = maxX - minX;
  const height = maxY - minY;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}" width="${width * 40}" height="${height * 40}">
    <rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="#f5f7fa" />\n`;

  const getRoomColor = (type: string) => {
    switch (type) {
      case 'living': return '#bfdbfe';
      case 'kitchen': return '#fcd34d';
      case 'bedroom': return '#bbf7d0';
      case 'bathroom': return '#e5e7eb';
      case 'circulation': return '#fef08a';
      case 'classroom': return '#93c5fd';
      case 'lab': return '#c4b5fd';
      case 'office': return '#fbcfe8';
      case 'corridor': return '#fde68a';
      default: return '#e2e8f0';
    }
  };

  rooms.forEach(room => {
    const color = getRoomColor(room.type);
    svg += `  <rect x="${room.x}" y="${room.y}" width="${room.width}" height="${room.height}" fill="${color}" stroke="#1e293b" stroke-width="0.1" />\n`;
    svg += `  <text x="${room.x + room.width / 2}" y="${room.y + room.height / 2}" font-family="sans-serif" font-size="0.6" fill="#1e293b" text-anchor="middle" dominant-baseline="middle">${room.name}</text>\n`;
    svg += `  <text x="${room.x + room.width / 2}" y="${room.y + room.height / 2 + 0.8}" font-family="sans-serif" font-size="0.4" fill="#64748b" text-anchor="middle" dominant-baseline="middle">${(room.width * room.height).toFixed(1)}m²</text>\n`;
  });

  svg += '</svg>';

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'archis_plan.svg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
