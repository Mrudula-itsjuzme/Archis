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

  return (
    <div className="flex-1 flex flex-col h-full relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 border-b border-gray-100 flex items-center justify-center px-6 relative shrink-0">
        <div className="absolute left-6 flex items-center gap-4">
          <button 
            onClick={resetModel}
            className="text-xs font-medium px-3 py-1.5 rounded hover:bg-gray-50 text-gray-600 transition-colors"
          >
            Reset Demo
          </button>
        </div>
        
        {/* Workspace Mode Controls */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setWorkspaceMode('plan')}
            className={`px-6 py-1.5 text-xs font-medium rounded-md transition-all ${workspaceMode === 'plan' ? 'bg-white shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Plan
          </button>
          <button 
            onClick={() => setWorkspaceMode('3d')}
            className={`px-6 py-1.5 text-xs font-medium rounded-md transition-all ${workspaceMode === '3d' ? 'bg-white shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
          >
            3D
          </button>
          <button 
            onClick={() => setWorkspaceMode('split')}
            className={`px-6 py-1.5 text-xs font-medium rounded-md transition-all ${workspaceMode === 'split' ? 'bg-white shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Split
          </button>
        </div>

        <div className="absolute right-6 flex items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-lg cursor-pointer" onClick={() => setClientViewMode(!clientViewMode)}>
            <div className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${!clientViewMode ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Design View</div>
            <div className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${clientViewMode ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Client View</div>
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
