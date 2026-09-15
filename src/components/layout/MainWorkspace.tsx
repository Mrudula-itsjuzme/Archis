import React from 'react';
import FloorPlan from '../2d/FloorPlan';
import Scene3D from '../3d/Scene3D';
import { useStore } from '../../store/useStore';

export default function MainWorkspace() {
  const resetModel = useStore(state => state.resetModel);
  const clientViewMode = useStore(state => state.clientViewMode);
  const setClientViewMode = useStore(state => state.setClientViewMode);
  const workspaceMode = useStore(state => state.workspaceMode);
  const setWorkspaceMode = useStore(state => state.setWorkspaceMode);
  const semanticOverlay = useStore(state => state.semanticOverlay);
  const setSemanticOverlay = useStore(state => state.setSemanticOverlay);

  return (
    <div className="absolute inset-0 flex flex-col h-full bg-[#efedea] overflow-hidden">
      {/* Floating Top Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-between px-6 py-2 shrink-0 bg-white/80 backdrop-blur-md z-30 rounded-full shadow-lg border border-white/60">
        
        {/* Left: Actions */}
        <div className="flex items-center gap-2 mr-6 border-r border-gray-200/60 pr-6">
          <button 
            onClick={resetModel}
            className="text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
          >
            Reset Demo
          </button>
        </div>
        
        {/* Center: Workspace Mode */}
        <div className="flex bg-gray-100/60 p-1 rounded-full border border-gray-200/50">
          <button 
            onClick={() => setWorkspaceMode('plan')}
            className={`px-5 py-1.5 text-xs font-bold rounded-full transition-all ${workspaceMode === 'plan' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            2D Plan
          </button>
          <button 
            onClick={() => setWorkspaceMode('3d')}
            className={`px-5 py-1.5 text-xs font-bold rounded-full transition-all ${workspaceMode === '3d' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            3D View
          </button>
          <button 
            onClick={() => setWorkspaceMode('split')}
            className={`px-5 py-1.5 text-xs font-bold rounded-full transition-all ${workspaceMode === 'split' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Split
          </button>
        </div>

        {/* Right: Overlays & Views */}
        <div className="flex items-center gap-4 ml-6 pl-6 border-l border-gray-200/60">
          <select 
            value={semanticOverlay}
            onChange={(e) => setSemanticOverlay(e.target.value as any)}
            className="px-4 py-1.5 text-xs font-bold bg-gray-100/60 border border-gray-200/50 rounded-full text-gray-700 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="none">Default Colors</option>
            <option value="privacy">Privacy Overlay</option>
            <option value="circulation">Circulation</option>
            <option value="daylight">Daylight</option>
          </select>

          <div className="flex bg-gray-100/60 p-1 rounded-full border border-gray-200/50 cursor-pointer" onClick={() => setClientViewMode(!clientViewMode)}>
            <div className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${!clientViewMode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Design</div>
            <div className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${clientViewMode ? 'bg-[#3b5998] shadow-sm text-white' : 'text-gray-500 hover:text-gray-700'}`}>Client</div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left: 2D View */}
        {(workspaceMode === 'plan' || workspaceMode === 'split') && (
          <div className={`${workspaceMode === 'split' ? 'flex-[1.2]' : 'flex-1'} relative overflow-hidden bg-[#efedea] border-r border-gray-200/50`}>
            <FloorPlan />
          </div>
        )}
        
        {/* Right: 3D View */}
        {(workspaceMode === '3d' || workspaceMode === 'split') && (
          <div className="flex-1 relative bg-[#efedea]">
            <Scene3D />
          </div>
        )}
      </div>
    </div>
  );
}
