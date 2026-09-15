import { ChangeEvent, useState } from 'react';
import { useStore } from '../../store/useStore';

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) => (
  <button className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium transition-all ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
    <span className="w-4 h-4 shrink-0">{icon}</span>
    {label}
  </button>
);

export default function Sidebar() {
  const {
    model, blueprintUrl, setBlueprintConfig,
    blueprintOpacity, blueprintScale, blueprintRotation, blueprintLocked,
    isExtracting, selectedSpaceId, setSelectedSpaceId
  } = useStore();

  const [activeNav, setActiveNav] = useState('blueprint');

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setBlueprintConfig({ url });
        setTimeout(() => useStore.getState().extractBlueprint(), 500);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-56 h-full bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-hidden">
      {/* Project header */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="text-sm font-semibold text-gray-800 truncate">{model.project.name || 'My Project'}</div>
        <div className="text-[10px] text-gray-400 mt-0.5">Educational Facility</div>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-0.5 p-3">
        <NavItem active={activeNav === 'home'} label="Home" icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        } />
        <NavItem label="New Project" icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        } />
        <NavItem label="Projects" icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
        } />
        <NavItem label="Settings" icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        } />
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-4">
        {/* Blueprint Input */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">Blueprint Input</div>
          <label className="cursor-pointer bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl hover:bg-blue-100 transition-colors flex flex-col items-center justify-center py-5 gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-blue-600">
              {blueprintUrl ? 'Replace Blueprint' : 'Upload Blueprint'}
            </span>
            <span className="text-[10px] text-gray-400">Drag & drop or browse</span>
            <span className="text-[10px] text-gray-300">PDF, PNG, JPG (max 50 MB)</span>
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleImageUpload} />
          </label>

          {blueprintUrl && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  Blueprint Loaded
                </span>
                <button className="text-[10px] text-red-400 hover:text-red-600 font-medium" onClick={() => setBlueprintConfig({ url: null })}>Clear</button>
              </div>
              <button
                onClick={() => useStore.getState().extractBlueprint()}
                disabled={isExtracting}
                className="w-full bg-gray-900 hover:bg-black text-white py-2 rounded-lg text-xs font-semibold transition-colors flex justify-center items-center gap-2 shadow-sm"
              >
                {isExtracting ? (
                  <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Analyzing...</>
                ) : '✨ Reconstruct Semantic Plan'}
              </button>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 mt-1">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1.5">Detection Results</p>
                <div className="flex justify-between text-[11px] text-gray-600"><span>Spaces Detected</span><span className="font-bold text-gray-900">{model.rooms.length}</span></div>
                <div className="flex justify-between text-[11px] text-gray-600 mt-1"><span>Levels Detected</span><span className="font-bold text-gray-900">1</span></div>
                {model.rooms.length > 0 && <p className="text-[10px] text-emerald-600 mt-2 font-medium">✓ Spatial graph built successfully</p>}
              </div>
            </div>
          )}
        </div>

        {/* Tools */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">Tools</div>
          <div className="flex flex-col gap-0.5">
            {[
              { label: 'Blueprint Alignment', icon: '⊞' },
              { label: 'Manual Corrections', icon: '✎' },
              { label: 'Measurement Tools', icon: '⟺' },
            ].map(t => (
              <button key={t.label} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium">
                <span className="text-base leading-none">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Spaces list */}
        {model.rooms.length > 0 && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">Spaces</div>
            <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
              {model.rooms.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSpaceId(s.id)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-[11px] transition-colors text-left ${selectedSpaceId === s.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
                >
                  <span className="w-2 h-2 rounded-sm bg-gray-300 shrink-0" />
                  <span className="truncate">{s.name}</span>
                  <span className="ml-auto text-[10px] text-gray-400 shrink-0">{(s.width * s.height).toFixed(0)}m²</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-3 py-3">
        <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Need help? View our quick start guide ↗
        </button>
      </div>
    </div>
  );
}
