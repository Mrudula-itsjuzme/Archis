import React from 'react';
import FloorPlan from '../2d/FloorPlan';
import Scene3D from '../3d/Scene3D';
import { useStore } from '../../store/useStore';

export default function MainWorkspace() {
  const resetModel = useStore(state => state.resetModel);
  const clientViewMode = useStore(state => state.clientViewMode);
  const setClientViewMode = useStore(state => state.setClientViewMode);

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Top Bar */}
      <div className="h-12 border-b bg-white flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={resetModel}
            className="text-xs font-mono uppercase tracking-widest text-[#2c2c2c]/60 hover:text-black"
          >
            Reset Demo
          </button>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest cursor-pointer">
            <input 
              type="checkbox" 
              checked={clientViewMode} 
              onChange={(e) => setClientViewMode(e.target.checked)} 
            />
            Client View
          </label>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left: 2D View */}
        <div className="flex-[1.2] relative overflow-hidden bg-[#fdfdfc] grid-bg border-r border-t-0 border-b-0 border-l-0">
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
    </div>
  );
}
