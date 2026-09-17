import React from 'react';
import Sidebar from './components/layout/Sidebar';
import MainWorkspace from './components/layout/MainWorkspace';
import RightSidebar from './components/layout/RightSidebar';
import ExtractionProgress from './components/ui/ExtractionProgress';
import { useStore } from './store/useStore';
import AuthAvatar from './components/ui/AuthAvatar';

const STEPS = [
  { num: 1, label: 'Upload', sub: 'Blueprint input' },
  { num: 2, label: 'Analyze', sub: 'AI processing' },
  { num: 3, label: '2D Plan', sub: 'Reconstructed plan' },
  { num: 4, label: '3D Model', sub: 'Spatial reconstruction' },
  { num: 5, label: 'Validate', sub: 'Check & refine' },
];

function App() {
  const blueprintUrl = useStore(s => s.blueprintUrl);
  const isExtracting = useStore(s => s.isExtracting);
  const rooms = useStore(s => s.model.rooms);
  const currentStep = !blueprintUrl ? 1 : isExtracting ? 2 : rooms.length > 0 ? 4 : 3;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#f5f7fa] overflow-hidden font-sans">
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 mr-10 shrink-0">
          <div className="w-7 h-7 rounded-full bg-[#2c2c2c] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16M4 12h16M4 19h7" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold leading-none">Archis</div>
            <div className="text-[9px] text-gray-400 tracking-widest uppercase">Semantic Design Engine</div>
          </div>
        </div>
        <div className="flex items-center gap-0 flex-1">
          {STEPS.map((step, i) => {
            const isActive = step.num === currentStep;
            const isDone = step.num < currentStep;
            return (
              <React.Fragment key={step.num}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-[#2c2c2c] text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {isDone ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : step.num}
                  </div>
                  <div>
                    <div className={`text-[12px] font-semibold leading-none ${isActive ? 'text-[#2c2c2c]' : isDone ? 'text-emerald-600' : 'text-gray-400'}`}>{step.label}</div>
                    <div className="text-[10px] text-gray-400 leading-none mt-0.5">{step.sub}</div>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-8 shrink-0 ${isDone ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="flex items-center gap-3 shrink-0">

          <button
            onClick={() => useStore.getState().saveCurrentProject()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            Save
          </button>

          <button
            onClick={() => {
              const store = useStore.getState();
              if (!store.blueprintUrl) {
                // Step 1: trigger file picker (no-op, user uses sidebar)
              } else if (store.isExtracting) {
                // Step 2: still extracting, do nothing
              } else if (store.model.rooms.length > 0 && store.workspaceMode === 'plan') {
                // Step 3→4: switch to 3D
                store.setWorkspaceMode('3d');
              } else if (store.workspaceMode === '3d') {
                // Step 4→5: switch to split for validation
                store.setWorkspaceMode('split');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#2c2c2c] text-white text-xs font-semibold rounded-lg hover:bg-black transition-colors"
          >
            Continue
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <AuthAvatar />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainWorkspace />
        <ExtractionProgress />
        <RightSidebar />
      </div>
    </div>
  );
}

export default App;
