import React, { useState } from 'react';
import FloorPlan from '../2d/FloorPlan';
import Scene3D from '../3d/Scene3D';
import { useStore } from '../../store/useStore';

const ANALYSIS_STEPS = [
  { label: 'Detecting walls', key: 'walls' },
  { label: 'Finding rooms', key: 'rooms' },
  { label: 'Identifying openings', key: 'openings' },
  { label: 'Building spatial graph', key: 'graph' },
  { label: 'Generating semantic plan', key: 'plan' },
];

export default function MainWorkspace() {
  const workspaceMode = useStore(state => state.workspaceMode);
  const setWorkspaceMode = useStore(state => state.setWorkspaceMode);
  const semanticOverlay = useStore(state => state.semanticOverlay);
  const isExtracting = useStore(state => state.isExtracting);
  const rooms = useStore(state => state.model.rooms);
  const blueprintUrl = useStore(state => state.blueprintUrl);

  const [plan2dTab, setPlan2dTab] = useState<'original' | 'overlay' | 'clean'>('clean');
  const [view3dTab, setView3dTab] = useState<'3d' | 'walkthrough' | 'exploded'>('3d');

  const hasData = rooms.length > 0;
  const analysisComplete = hasData && !isExtracting;

  // Simulate which step is current during extraction
  const currentAnalysisStep = isExtracting ? 3 : (hasData ? 5 : 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Analysis Progress Bar */}
      {blueprintUrl && (
        <div className={`px-6 py-3 border-b border-gray-100 flex items-center gap-4 text-xs shrink-0 ${isExtracting ? 'bg-blue-50' : analysisComplete ? 'bg-emerald-50' : 'bg-gray-50'}`}>
          <div className={`font-semibold ${isExtracting ? 'text-blue-700' : 'text-emerald-700'}`}>
            {isExtracting ? 'AI Analysis in Progress...' : 'AI Analysis Complete'}
          </div>
          <div className="flex items-center gap-3 flex-1">
            {ANALYSIS_STEPS.map((step, i) => {
              const done = i < currentAnalysisStep;
              const active = i === currentAnalysisStep - 1 && isExtracting;
              return (
                <div key={step.key} className="flex items-center gap-1.5">
                  {done ? (
                    <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : active ? (
                    <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-gray-300 shrink-0" />
                  )}
                  <span className={done ? 'text-emerald-600 font-medium' : active ? 'text-blue-600 font-medium' : 'text-gray-400'}>
                    {step.label}
                    {done && <span className="ml-1 text-emerald-500 text-[10px]">Complete</span>}
                    {active && <span className="ml-1 text-blue-400 text-[10px]">Processing...</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top toolbar */}
      <div className="h-12 border-b border-gray-100 flex items-center px-4 gap-3 shrink-0 bg-white">
        <div className="flex bg-gray-100 p-0.5 rounded-lg">
          {(['plan', '3d', 'split'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setWorkspaceMode(mode)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${workspaceMode === mode ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {mode === 'plan' ? '2D Plan' : mode === '3d' ? '3D View' : 'Split'}
            </button>
          ))}
        </div>
        <div className="h-5 w-px bg-gray-200" />
        <select
          value={semanticOverlay}
          onChange={e => useStore.getState().setSemanticOverlay(e.target.value as any)}
          className="text-xs text-gray-600 border border-gray-200 rounded-md px-2 py-1.5 bg-white outline-none"
        >
          <option value="none">Space Colors</option>
          <option value="privacy">Privacy Zones</option>
          <option value="circulation">Circulation</option>
          <option value="daylight">Daylight</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => useStore.getState().resetModel()} className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
            Reset Demo
          </button>
        </div>
      </div>

      {/* Main split view */}
      <div className="flex-1 flex overflow-hidden">
        {/* 2D Panel */}
        {(workspaceMode === 'plan' || workspaceMode === 'split') && (
          <div className={`${workspaceMode === 'split' ? 'flex-[1.2]' : 'flex-1'} flex flex-col border-r border-gray-100 overflow-hidden`}>
            {/* 2D panel header */}
            <div className="h-10 flex items-center justify-between px-4 bg-white border-b border-gray-100 shrink-0">
              <span className="text-xs font-semibold text-gray-700">2D Plan (Reconstructed)</span>
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                {[
                  { key: 'original', label: 'Original Blueprint' },
                  { key: 'overlay', label: 'Semantic Overlay' },
                  { key: 'clean', label: 'Clean Plan' },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setPlan2dTab(t.key as any)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${plan2dTab === t.key ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              {/* Scale bar + expand */}
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <span>100%</span>
                <button className="hover:text-gray-600">⤢</button>
              </div>
            </div>
            <div className="flex-1 relative overflow-hidden bg-[#f8f9fb]" style={{ backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
              <FloorPlan view={plan2dTab} />
              {/* North arrow + scale bar */}
              <div className="absolute bottom-4 left-4 flex items-end gap-3 pointer-events-none">
                <div className="flex flex-col items-center text-[10px] text-gray-500">
                  <span className="font-bold">N</span>
                  <div className="w-px h-5 bg-gray-500" />
                  <div className="w-2 h-2 border-t-2 border-l-2 border-gray-500 rotate-45 -mt-1" />
                </div>
                <div>
                  <div className="flex">
                    {[0,1,2,3,4,5].map(i => (
                      <div key={i} className={`w-7 h-2 border border-gray-400 ${i % 2 === 0 ? 'bg-gray-700' : 'bg-white'}`} />
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-500 mt-0.5">
                    <span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10 m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3D Panel */}
        {(workspaceMode === '3d' || workspaceMode === 'split') && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 3D panel header */}
            <div className="h-10 flex items-center justify-between px-4 bg-white border-b border-gray-100 shrink-0">
              <span className="text-xs font-semibold text-gray-700">3D Model (Generated)</span>
              <div className="flex items-center gap-2">
                <select className="text-xs text-gray-600 border border-gray-200 rounded-md px-2 py-1 bg-white outline-none">
                  <option>Perspective</option>
                  <option>Orthographic</option>
                </select>
                <button className="hover:text-gray-600 text-gray-400 text-xs">⤢</button>
              </div>
            </div>
            <div className="flex-1 relative bg-[#e8eaed] overflow-hidden">
              <Scene3D />
              {/* 3D sub-toolbar at bottom */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden">
                {[
                  { key: '3d', label: '3D View', icon: '⬚' },
                  { key: 'walkthrough', label: 'Walkthrough', icon: '🚶' },
                  { key: 'exploded', label: 'Exploded', icon: '⊞' },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setView3dTab(t.key as any)}
                    className={`px-4 py-2.5 text-xs font-medium flex items-center gap-1.5 transition-colors ${view3dTab === t.key ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <span>{t.icon}</span>{t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
