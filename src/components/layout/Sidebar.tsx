import { ChangeEvent, useState } from 'react';
import { useStore } from '../../store/useStore';
import { courtyardHouseProject, apartmentFloorProject, schoolWingProject } from '../../store/initialData';

export default function Sidebar() {
  const { 
    model, loadProject, 
    blueprintUrl, setBlueprintConfig, 
    blueprintOpacity,
    blueprintScale, blueprintRotation, blueprintLocked,
    isExtracting,
    selectedSpaceId, setSelectedSpaceId
  } = useStore();

  const [activeTab, setActiveTab] = useState<"project" | "input" | "views">('project');

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setBlueprintConfig({ url });
        setTimeout(() => {
          useStore.getState().extractBlueprint();
        }, 500);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-72 h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-5 pb-0 shrink-0 mb-4">
        <h1 className="text-xl font-bold tracking-tight mb-1">Archis</h1>
        <p className="text-xs text-gray-500 font-mono tracking-wide">SEMANTIC DESIGN ENGINE</p>
      </div>
      
      {/* Tabs */}
      <div className="flex p-2 shrink-0 border-b border-gray-100">
        <div className="flex w-full bg-gray-100/80 p-1 rounded-lg border border-gray-200/50">
          <button 
            onClick={() => setActiveTab('project')}
            className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'project' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Project
          </button>
          <button 
            onClick={() => setActiveTab('input')}
            className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'input' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Blueprint
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'project' && (
          <>
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Active Project</h2>
              <select 
                className="bg-gray-50 border border-gray-200 p-2 text-xs font-medium rounded-md outline-none text-gray-700 cursor-pointer"
                value={model.project.id}
                onChange={(e) => {
                  if (e.target.value === 'proj_courtyard') loadProject(courtyardHouseProject);
                  else if (e.target.value === 'proj_apt') loadProject(apartmentFloorProject);
                  else if (e.target.value === 'proj_school') loadProject(schoolWingProject);
                }}
              >
                <option value="proj_courtyard">Courtyard House</option>
                <option value="proj_apt">Apartment Floor</option>
                <option value="proj_school">School Wing</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Semantic Graph</h2>
              <div className="text-sm">
                <div className="font-semibold text-gray-800">{model.project.name}</div>
                <div className="ml-2 pl-3 border-l border-gray-200 mt-2 flex flex-col gap-2">
                  {model.project.buildings.map(b => (
                    <div key={b.id}>
                      <div className="text-gray-600 text-xs font-medium flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        {b.name}
                      </div>
                      <div className="ml-2 pl-3 border-l border-gray-200 mt-1 flex flex-col gap-1">
                        {b.levels.map(l => (
                          <div key={l.id}>
                            <div className="text-gray-500 text-[11px] font-medium flex items-center gap-2 py-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                              {l.name}
                            </div>
                            <div className="ml-2 pl-3 border-l border-gray-200 mt-1 flex flex-col gap-0.5">
                              {l.spaces.map(s => (
                                <div 
                                  key={s.id} 
                                  onClick={() => setSelectedSpaceId(s.id)}
                                  className={`text-[11px] py-1 px-2 rounded cursor-pointer transition-colors flex items-center gap-2 ${selectedSpaceId === s.id ? 'bg-[#e5ecf6] text-[#3b5998] font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                                >
                                  <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                  {s.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'input' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Blueprint Input</h2>
            
            <label className="cursor-pointer bg-white border border-dashed border-[#3b5998]/40 bg-[#3b5998]/5 rounded-lg hover:bg-[#3b5998]/10 transition-colors flex items-center justify-center py-4 text-xs font-bold text-[#3b5998] mb-2">
              {blueprintUrl ? 'Replace Blueprint Image' : '+ Upload Blueprint'}
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleImageUpload} />
            </label>

            {blueprintUrl && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs flex flex-col gap-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Blueprint Loaded</span>
                  <button className="text-red-500 font-medium hover:underline" onClick={() => setBlueprintConfig({url: null})}>Clear</button>
                </div>
                
                <button 
                  onClick={() => useStore.getState().extractBlueprint()}
                  disabled={isExtracting}
                  className="w-full bg-[#3b5998] hover:bg-[#2d4373] text-white py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors flex justify-center items-center gap-2"
                >
                  {isExtracting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : (
                    '✨ Reconstruct Semantic Plan'
                  )}
                </button>

                <div className="mt-2 bg-white border border-gray-200 rounded p-2">
                  <p className="text-[10px] text-gray-500 font-semibold mb-1 uppercase tracking-wider">Detection Results (Simulated)</p>
                  <p className="text-xs text-gray-700 font-medium flex justify-between">Spaces Detected: <span className="text-[#3b5998]">{model.rooms.length}</span></p>
                  <p className="text-xs text-gray-700 font-medium flex justify-between">Levels Detected: <span className="text-[#3b5998]">1</span></p>
                  <p className="text-[10px] text-emerald-600 mt-2 font-medium">✓ Spatial graph built successfully</p>
                </div>

                <details className="group mt-2">
                  <summary className="text-[10px] font-bold uppercase tracking-wider text-gray-400 cursor-pointer list-none flex items-center justify-between">
                    Manual Alignment (Fallback)
                    <span className="group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="flex flex-col gap-2 pt-3 border-t border-gray-200 mt-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="flex justify-between text-gray-600 font-medium text-[10px]">Opacity <span className="text-gray-900">{Math.round(blueprintOpacity * 100)}%</span></label>
                      <input type="range" min="0" max="1" step="0.1" value={blueprintOpacity} onChange={(e) => setBlueprintConfig({ opacity: parseFloat(e.target.value) })} className="accent-[#3b5998]" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="flex justify-between text-gray-600 font-medium text-[10px]">Scale <span className="font-mono text-gray-900">{blueprintScale.toFixed(1)}</span></label>
                      <input type="range" min="1" max="500" step="0.1" value={blueprintScale} onChange={(e) => setBlueprintConfig({ scale: parseFloat(e.target.value) })} className="accent-[#3b5998]" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="flex justify-between text-gray-600 font-medium text-[10px]">Rotation <span className="font-mono text-gray-900">{blueprintRotation}°</span></label>
                      <input type="range" min="-180" max="180" step="0.5" value={blueprintRotation} onChange={(e) => setBlueprintConfig({ rotation: parseFloat(e.target.value) })} className="accent-[#3b5998]" />
                    </div>
                    
                    <label className="flex items-center gap-2 cursor-pointer mt-1 pt-1 text-gray-700 font-medium text-[10px]">
                      <input type="checkbox" checked={blueprintLocked} onChange={(e) => setBlueprintConfig({ locked: e.target.checked })} className="accent-[#3b5998] rounded w-3 h-3" />
                      Lock alignment
                    </label>
                  </div>
                </details>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
