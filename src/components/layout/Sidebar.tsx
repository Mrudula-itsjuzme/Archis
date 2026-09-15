import { ChangeEvent } from 'react';
import { useStore } from '../../store/useStore';
import { courtyardHouseProject, apartmentFloorProject, schoolWingProject } from '../../store/initialData';

export default function Sidebar() {
  const { 
    model, loadProject, 
    blueprintUrl, setBlueprintConfig, 
    blueprintOpacity,
    blueprintScale, blueprintRotation, blueprintLocked 
  } = useStore();

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBlueprintConfig({ url });
    }
  };

  return (
    <div className="w-72 h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto flex flex-col p-5 gap-6">
      <div className="mb-2">
        <h1 className="text-xl font-bold tracking-tight mb-1">Archis</h1>
        <p className="text-xs opacity-60 font-mono">SEMANTIC DESIGN ENGINE</p>
      </div>
      
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wider opacity-50">Demo Projects</h2>
        <select 
          className="bg-white draft-border p-2 text-sm outline-none"
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
        <h2 className="text-xs font-bold uppercase tracking-wider opacity-50">Project Tree</h2>
        <div className="text-sm">
          <div className="font-bold">{model.project.name}</div>
          <div className="ml-2 pl-2 border-l border-gray-300">
            {model.project.buildings.map(b => (
              <div key={b.id}>
                <div className="text-gray-700">{b.name}</div>
                <div className="ml-2 pl-2 border-l border-gray-300">
                  {b.levels.map(l => (
                    <div key={l.id}>
                      <div className="text-gray-600">{l.name}</div>
                      <div className="ml-2 pl-2 border-l border-gray-300">
                        {l.spaces.map(s => (
                          <div key={s.id} className="text-gray-500 text-xs py-0.5 hover:text-blue-600 cursor-pointer">
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

      <div className="flex flex-col gap-2 mt-auto">
        <h2 className="text-xs font-bold uppercase tracking-wider opacity-50">Tracing Layer</h2>
        {!blueprintUrl ? (
          <label className="cursor-pointer bg-white draft-border hover:bg-gray-50 transition-colors flex items-center justify-center py-2 text-xs font-mono uppercase">
            Upload Blueprint
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleImageUpload} />
          </label>
        ) : (
          <div className="bg-white draft-border p-3 text-xs flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="font-mono">Underlay Active</span>
              <button className="text-red-500 underline" onClick={() => setBlueprintConfig({url: null})}>Remove</button>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="flex justify-between">Opacity <span>{Math.round(blueprintOpacity * 100)}%</span></label>
              <input type="range" min="0" max="1" step="0.1" value={blueprintOpacity} onChange={(e) => setBlueprintConfig({ opacity: parseFloat(e.target.value) })} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="flex justify-between">Scale <span>{blueprintScale}</span></label>
              <input type="range" min="10" max="100" step="1" value={blueprintScale} onChange={(e) => setBlueprintConfig({ scale: parseFloat(e.target.value) })} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="flex justify-between">Rotation <span>{blueprintRotation}°</span></label>
              <input type="range" min="-180" max="180" step="1" value={blueprintRotation} onChange={(e) => setBlueprintConfig({ rotation: parseFloat(e.target.value) })} />
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input type="checkbox" checked={blueprintLocked} onChange={(e) => setBlueprintConfig({ locked: e.target.checked })} />
              Lock position
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
