import React from 'react';
import FloorPlan from '../2d/FloorPlan';
import Scene3D from '../3d/Scene3D';
import SemanticExplanation from '../ui/SemanticExplanation';

export default function MainWorkspace() {
  return (
    <div className="flex-1 flex flex-col h-full relative">
      <div className="flex-1 flex">
        {/* Left: 2D View */}
        <div className="flex-[1.2] relative overflow-hidden bg-[#fdfdfc] grid-bg draft-border border-r border-t-0 border-b-0 border-l-0">
          <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-white draft-border text-[10px] font-mono uppercase tracking-widest text-[#2c2c2c]/60">
            2D Interactive Plan
          </div>
          <FloorPlan />
        </div>
        
        {/* Right: 3D View */}
        <div className="flex-1 relative bg-[#efedea]">
          <div className="absolute top-6 right-6 z-10 px-4 py-2 bg-[#efedea]/50 border border-[rgba(44,44,44,0.1)] backdrop-blur text-[10px] font-mono uppercase tracking-widest text-[#2c2c2c]/50">
            3D Semantic Extrusion
          </div>
          <Scene3D />
        </div>
      </div>
      
      {/* Bottom explanation panel */}
      <div className="h-44 draft-border border-t border-l-0 border-r-0 border-b-0 bg-[#fdfdfc] p-8 overflow-y-auto">
        <SemanticExplanation />
      </div>
    </div>
  );
}
