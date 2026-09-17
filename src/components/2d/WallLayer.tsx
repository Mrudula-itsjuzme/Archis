import React, { useCallback, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Wall, Vertex, Opening } from '../../models/types';

interface WallLayerProps {
  scale: number;
  offsetX: number;
  offsetY: number;
}

const VERTEX_RADIUS = 5;
const WALL_COLOR = '#1e293b';
const WALL_SELECTED_COLOR = '#3b82f6';
const VERTEX_COLOR = '#3b82f6';
const VERTEX_HOVER_COLOR = '#ef4444';

function toScreen(meters: number, scale: number, offset: number) {
  return meters * scale + offset;
}

function toMeters(px: number, scale: number, offset: number) {
  return (px - offset) / scale;
}

export default function WallLayer({ scale, offsetX, offsetY }: WallLayerProps) {
  const model = useStore(s => s.model);
  const moveVertex = useStore(s => s.moveVertex);
  const selectedVertexId = useStore(s => s.selectedVertexId);
  const setSelectedVertexId = useStore(s => s.setSelectedVertexId);
  const editorMode = useStore(s => s.editorMode);

  const vertices = model.vertices || [];
  const walls = model.walls || [];
  const openings = model.openings || [];

  const dragging = useRef<{ id: string; startX: number; startY: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const vertexById = new Map(vertices.map(v => [v.id, v]));

  const getWallLength = (w: Wall) => {
    const s = vertexById.get(w.startVertexId);
    const e = vertexById.get(w.endVertexId);
    if (!s || !e) return 0;
    return Math.sqrt((e.x - s.x) ** 2 + (e.y - s.y) ** 2);
  };

  // Convert canvas pointer event to meter coords
  const ptrToMeters = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: toMeters(e.clientX - rect.left, scale, offsetX),
      y: toMeters(e.clientY - rect.top, scale, offsetY),
    };
  };

  const handleVertexPointerDown = useCallback((e: React.PointerEvent, vId: string) => {
    if (editorMode !== 'select') return;
    e.stopPropagation();
    setSelectedVertexId(vId);
    dragging.current = { id: vId, startX: e.clientX, startY: e.clientY };
    (e.currentTarget as SVGCircleElement).setPointerCapture(e.pointerId);
  }, [editorMode, setSelectedVertexId]);

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    const { x, y } = ptrToMeters(e);
    moveVertex(dragging.current.id, x, y);
  }, [moveVertex]);

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  // Compute SVG size to cover the full content area
  const allX = vertices.map(v => toScreen(v.x, scale, offsetX));
  const allY = vertices.map(v => toScreen(v.y, scale, offsetY));
  const svgW = vertices.length > 0 ? Math.max(...allX) + 80 : 800;
  const svgH = vertices.length > 0 ? Math.max(...allY) + 80 : 600;

  if (vertices.length === 0) return null;

  return (
    <svg
      ref={svgRef}
      className="absolute top-0 left-0 pointer-events-none"
      style={{ width: svgW, height: svgH, overflow: 'visible' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <defs>
        <marker id="snap-indicator" markerWidth="4" markerHeight="4" refX="2" refY="2">
          <circle cx="2" cy="2" r="1.5" fill="#3b82f6" />
        </marker>
      </defs>

      {/* Walls */}
      {walls.map(w => {
        const s = vertexById.get(w.startVertexId);
        const e = vertexById.get(w.endVertexId);
        if (!s || !e) return null;

        const x1 = toScreen(s.x, scale, offsetX);
        const y1 = toScreen(s.y, scale, offsetY);
        const x2 = toScreen(e.x, scale, offsetX);
        const y2 = toScreen(e.y, scale, offsetY);

        const len = getWallLength(w);
        const thicknessPx = Math.max(2, w.thickness * scale);

        // Draw wall openings (doors/windows) as gaps
        const wallOpenings = openings.filter(o => o.wallId === w.id);

        return (
          <g key={w.id}>
            {/* Thick wall body */}
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={w.isExterior ? '#0f172a' : WALL_COLOR}
              strokeWidth={thicknessPx}
              strokeLinecap="square"
              opacity={0.85}
            />
            {/* Thin wall centre line for clarity */}
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={1}
              strokeDasharray="4 4"
              strokeLinecap="butt"
            />
            {/* Wall length label */}
            {len > 0.5 && (
              <text
                x={(x1 + x2) / 2}
                y={(y1 + y2) / 2 - 6}
                fontSize="9"
                fill="#64748b"
                textAnchor="middle"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {len.toFixed(1)}m
              </text>
            )}
            {/* Door openings */}
            {wallOpenings.filter(o => o.type === 'door').map(o => {
              const t = len > 0 ? o.distanceAlongWall / len : 0;
              const ox = x1 + (x2 - x1) * t;
              const oy = y1 + (y2 - y1) * t;
              const dx = (x2 - x1) / (len * scale) * o.width * scale;
              const dy = (y2 - y1) / (len * scale) * o.width * scale;
              return (
                <g key={o.id}>
                  <line x1={ox - dx / 2} y1={oy - dy / 2} x2={ox + dx / 2} y2={oy + dy / 2}
                    stroke="#f59e0b" strokeWidth={3} strokeLinecap="round" />
                  <circle cx={ox} cy={oy} r={3} fill="#f59e0b" />
                </g>
              );
            })}
            {/* Window openings */}
            {wallOpenings.filter(o => o.type === 'window').map(o => {
              const t = len > 0 ? o.distanceAlongWall / len : 0;
              const ox = x1 + (x2 - x1) * t;
              const oy = y1 + (y2 - y1) * t;
              const dx = (x2 - x1) / (len * scale) * o.width * scale;
              const dy = (y2 - y1) / (len * scale) * o.width * scale;
              return (
                <g key={o.id}>
                  <line x1={ox - dx / 2} y1={oy - dy / 2} x2={ox + dx / 2} y2={oy + dy / 2}
                    stroke="#38bdf8" strokeWidth={4} strokeLinecap="round" />
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Vertices — pointer-events enabled */}
      {editorMode === 'select' && vertices.map(v => {
        const cx = toScreen(v.x, scale, offsetX);
        const cy = toScreen(v.y, scale, offsetY);
        const isSelected = v.id === selectedVertexId;
        return (
          <circle
            key={v.id}
            cx={cx}
            cy={cy}
            r={isSelected ? VERTEX_RADIUS + 2 : VERTEX_RADIUS}
            fill={isSelected ? VERTEX_HOVER_COLOR : 'white'}
            stroke={isSelected ? VERTEX_HOVER_COLOR : VERTEX_COLOR}
            strokeWidth={2}
            style={{ cursor: 'grab', pointerEvents: 'all' }}
            onPointerDown={e => handleVertexPointerDown(e, v.id)}
          />
        );
      })}

      {/* Snap grid indicator when dragging */}
      {dragging.current && selectedVertexId && (() => {
        const v = vertexById.get(selectedVertexId);
        if (!v) return null;
        const cx = toScreen(v.x, scale, offsetX);
        const cy = toScreen(v.y, scale, offsetY);
        return (
          <circle cx={cx} cy={cy} r={VERTEX_RADIUS + 6} fill="none" stroke="#3b82f6"
            strokeWidth={1.5} strokeDasharray="3 3" opacity={0.7} />
        );
      })()}
    </svg>
  );
}
