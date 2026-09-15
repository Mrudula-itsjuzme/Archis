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
    <div className="flex-1 flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 shrink-0 bg-white z-10">
        
        {/* Left: Actions */}
        <div className="flex items-center gap-2">
          <button 
            onClick={resetModel}
            className="text-xs font-medium px-3 py-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
          >
            Reset Demo
          </button>
        </div>
        
        {/* Center: Workspace Mode */}
        <div className="flex bg-gray-100/80 p-1 rounded-lg border border-gray-200/50">
          <button 
            onClick={() => setWorkspaceMode('plan')}
            className={`px-5 py-1 text-xs font-medium rounded-md transition-all ${workspaceMode === 'plan' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Plan
          </button>
          <button 
            onClick={() => setWorkspaceMode('3d')}
            className={`px-5 py-1 text-xs font-medium rounded-md transition-all ${workspaceMode === '3d' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            3D
          </button>
          <button 
            onClick={() => setWorkspaceMode('split')}
            className={`px-5 py-1 text-xs font-medium rounded-md transition-all ${workspaceMode === 'split' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Split
          </button>
        </div>

        {/* Right: Overlays & Views */}
        <div className="flex items-center gap-3">
          <select 
            value={semanticOverlay}
            onChange={(e) => useStore.getState().setSemanticOverlay(e.target.value as any)}
            className="px-3 py-1.5 text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg text-gray-700 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="none">Space (Default)</option>
            <option value="privacy">Privacy Zones</option>
            <option value="circulation">Circulation</option>
            <option value="daylight">Daylight</option>
          </select>

          <div className="flex bg-gray-100/80 p-1 rounded-lg border border-gray-200/50 cursor-pointer" onClick={() => setClientViewMode(!clientViewMode)}>
            <div className={`px-4 py-1 text-xs font-medium rounded-md transition-all ${!clientViewMode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Design View</div>
            <div className={`px-4 py-1 text-xs font-medium rounded-md transition-all ${clientViewMode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Client View</div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left: 2D View */}
        {(workspaceMode === 'plan' || workspaceMode === 'split') && (
          <div className={`${workspaceMode === 'split' ? 'flex-[1.2]' : 'flex-1'} relative overflow-hidden bg-[#faf9f6] grid-bg border-r border-gray-100`}>
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
