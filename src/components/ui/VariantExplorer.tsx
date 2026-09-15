import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { generatePreserveVariant, generateMorePrivateVariant, generateMoreCompactVariant } from '../../engine/variants';
import ChangeRequestExplorer from './ChangeRequestExplorer';

export default function VariantExplorer() {
  const { originalModel, applyVariant, activeVariant, resetModel, setPreviewVariantModel } = useStore();
  const [mode, setMode] = useState<'request' | 'explore'>('request');
  const variants = [
    { id: 'original', name: 'Preserve Original', desc: 'Minimal adjustments to lock in current design.', ...generatePreserveVariant(originalModel) },
    { id: 'private', name: 'More Private', desc: 'Isolates bedrooms from living areas.', ...generateMorePrivateVariant(originalModel) },
    { id: 'compact', name: 'More Compact', desc: 'Reduces footprint and circulation.', ...generateMoreCompactVariant(originalModel) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 rounded-lg bg-gray-100 p-1 text-[10px]">
        <button onClick={() => setMode('request')} className={`rounded-md py-1.5 ${mode === 'request' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Requested change</button>
        <button onClick={() => setMode('explore')} className={`rounded-md py-1.5 ${mode === 'explore' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Broad variants</button>
      </div>

      {activeVariant !== 'original' && <button onClick={resetModel} className="self-start text-[10px] font-medium text-gray-500 hover:text-gray-900">← Revert to architect draft</button>}

      {mode === 'request' ? <ChangeRequestExplorer /> : variants.map(v => (
        <div key={v.id} onClick={() => { applyVariant(v.model, v.id as any); setPreviewVariantModel(null); }} onMouseEnter={() => setPreviewVariantModel(v.model)} onMouseLeave={() => setPreviewVariantModel(null)} className={`rounded-xl p-3 bg-white cursor-pointer transition-all border ${activeVariant === v.id ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'}`}>
          <div className="flex justify-between items-baseline"><h3 className="font-medium text-xs text-gray-900">{v.name}</h3>{activeVariant === v.id && <span className="text-[9px] uppercase tracking-wider text-gray-500">Active</span>}</div>
          <p className="mt-1 text-[11px] text-gray-500">{v.desc}</p>
          <div className="mt-2 text-[10px] leading-4 text-gray-400">Preserved: {v.stats.preservedAdjacencies.join(' · ')}</div>
        </div>
      ))}
    </div>
  );
}
