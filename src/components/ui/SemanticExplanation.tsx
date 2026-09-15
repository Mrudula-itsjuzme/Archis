import React from 'react';

export default function SemanticExplanation() {
  return (
    <div className="flex gap-16 h-full items-center max-w-5xl mx-auto">
      <div className="max-w-sm">
        <h2 className="text-xs uppercase tracking-[0.2em] font-mono text-[#3b5998] mb-3">Core Concept</h2>
        <p className="text-[13px] text-[#2c2c2c]/80 leading-relaxed font-light">
          This is not a drawing. The building exists as a single semantic model in memory. 
          The 2D and 3D panes are entirely separate renderers consuming the exact same structural logic.
        </p>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-6 text-[12px] font-light text-[#2c2c2c]/70">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#2c2c2c] block mb-1">Room</span>
          Not just a rectangle, but a programmatic space with privacy and area requirements.
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#2c2c2c] block mb-1">Wall</span>
          Inferred dynamically from boundaries, not a manually drawn line.
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#2c2c2c] block mb-1">Adjacency</span>
          Computed via bounding box overlaps. Moving a room severs or creates links.
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#2c2c2c] block mb-1">Constraints</span>
          Act continuously on the state, totally independent of how it is visualized.
        </div>
      </div>
    </div>
  );
}
