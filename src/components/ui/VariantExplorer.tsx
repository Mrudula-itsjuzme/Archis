import { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { ExplainableVariant, generatePreserveVariant, generateMorePrivateVariant, generateMoreCompactVariant } from '../../engine/variants';
import ChangeRequestExplorer from './ChangeRequestExplorer';

type VariantOption = ExplainableVariant & {
  id: 'original' | 'private' | 'compact';
  name: string;
  description: string;
};

export default function VariantExplorer() {
  const { originalModel, applyVariant, activeVariant, resetModel, setPreviewVariantModel } = useStore();
  const [mode, setMode] = useState<'request' | 'explore'>('request');
  const [pendingApplyId, setPendingApplyId] = useState<VariantOption['id'] | null>(null);
  const variants = useMemo<VariantOption[]>(() => [
    { id: 'original', name: 'Architect baseline', description: 'Restores the draft without automatic geometry adjustments.', ...generatePreserveVariant(originalModel) },
    { id: 'private', name: 'More private', description: 'A bounded separation option for private rooms and circulation.', ...generateMorePrivateVariant(originalModel) },
    { id: 'compact', name: 'More compact', description: 'A bounded reduction option for room and circulation rectangles.', ...generateMoreCompactVariant(originalModel) },
  ], [originalModel]);

  const apply = (variant: VariantOption) => {
    if (!variant.readiness.ready) return;
    if (variant.id === 'original') resetModel();
    else applyVariant(variant.model, variant.id);
    setPreviewVariantModel(null);
    setPendingApplyId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 rounded-lg bg-gray-100 p-1 text-[10px]">
        <button onClick={() => { setMode('request'); setPendingApplyId(null); }} className={`rounded-md py-1.5 ${mode === 'request' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Requested change</button>
        <button onClick={() => { setMode('explore'); setPendingApplyId(null); }} className={`rounded-md py-1.5 ${mode === 'explore' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Broad options</button>
      </div>

      {activeVariant !== 'original' && <button onClick={resetModel} className="self-start text-[10px] font-medium text-gray-500 hover:text-gray-900">← Revert to architect draft</button>}

      {mode === 'request' ? <ChangeRequestExplorer /> : variants.map(variant => {
        const isPending = pendingApplyId === variant.id && variant.readiness.ready;
        const constraints = variant.preservedConstraints.length
          ? `Preserved in the current hard-rule screen: ${variant.preservedConstraints.join(' · ')}`
          : 'No applicable hard rule is asserted as preserved.';
        return (
          <div key={variant.id} className={`rounded-xl border bg-white p-3 transition-all ${activeVariant === variant.id ? 'border-gray-900' : 'border-gray-200'}`}>
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-xs font-medium text-gray-900">{variant.name}</h3>
              <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${variant.readiness.ready ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>{variant.readiness.ready ? 'Ready for review' : 'Not ready to apply'}</span>
            </div>
            <p className="mt-1 text-[11px] text-gray-500">{variant.description}</p>
            <div className="mt-2 space-y-1 text-[10px] leading-4 text-gray-600">
              <div><span className="font-medium text-gray-700">Changes:</span> {variant.whatChanges.join(' · ')}</div>
              <div><span className="font-medium text-gray-700">Why:</span> {variant.why}</div>
              <div><span className="font-medium text-gray-700">Affected:</span> {variant.affectedEntities.length ? variant.affectedEntities.join(', ') : 'No entities changed.'}</div>
              <div><span className="font-medium text-gray-700">Constraints:</span> {constraints}</div>
              <div><span className="font-medium text-gray-700">Confidence:</span> {variant.confidence}</div>
              <div><span className="font-medium text-gray-700">Tradeoff:</span> {variant.tradeoff}</div>
              <div className={variant.readiness.ready ? 'text-emerald-700' : 'text-amber-800'}><span className="font-medium">Readiness:</span> {variant.readiness.reason}</div>
              <div className="text-gray-400"><span className="font-medium text-gray-500">Provisional:</span> {variant.provisionalNotes.join(' ')}</div>
              {variant.id !== 'original' && <div className="text-gray-400">Rectangular-space area estimate: circulation {variant.stats.circulationAreaChange >= 0 ? '+' : ''}{variant.stats.circulationAreaChange.toFixed(2)} m²; other spaces {variant.stats.primaryAreaChange >= 0 ? '+' : ''}{variant.stats.primaryAreaChange.toFixed(2)} m².</div>}
            </div>
            <div className="mt-3 flex gap-1.5">
              <button
                disabled={!variant.readiness.ready}
                onMouseEnter={() => variant.readiness.ready && setPreviewVariantModel(variant.model)}
                onMouseLeave={() => setPreviewVariantModel(null)}
                onClick={() => variant.readiness.ready && setPreviewVariantModel(variant.model)}
                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >Preview</button>
              {isPending ? <>
                <button onClick={() => apply(variant)} className="rounded-md bg-gray-900 px-2 py-1 text-[10px] font-medium text-white hover:bg-black">Confirm apply</button>
                <button onClick={() => setPendingApplyId(null)} className="rounded-md px-2 py-1 text-[10px] font-medium text-gray-500 hover:text-gray-900">Cancel</button>
              </> : <button
                disabled={!variant.readiness.ready}
                onClick={() => variant.readiness.ready && setPendingApplyId(variant.id)}
                className="rounded-md bg-gray-900 px-2 py-1 text-[10px] font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
              >{variant.id === 'original' ? 'Restore baseline' : 'Apply reviewed option'}</button>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
