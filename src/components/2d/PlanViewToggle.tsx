import { useStore } from '../../store/useStore';

export default function PlanViewToggle() {
  const opacity = useStore(state => state.blueprintOpacity);
  const setConfig = useStore(state => state.setBlueprintConfig);
  const hasBlueprint = !!useStore(state => state.blueprintUrl);

  if (!hasBlueprint) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-200 flex p-1 z-40">
      <button 
        onClick={() => setConfig({ opacity: 1 })}
        className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${opacity > 0.8 ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
      >
        Original Blueprint
      </button>
      <button 
        onClick={() => setConfig({ opacity: 0.5 })}
        className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${opacity > 0.1 && opacity <= 0.8 ? 'bg-[#3b5998] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
      >
        Compare
      </button>
      <button 
        onClick={() => setConfig({ opacity: 0 })}
        className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${opacity <= 0.1 ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
      >
        Reconstructed Plan
      </button>
    </div>
  );
}
