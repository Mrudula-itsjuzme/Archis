import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { generateKitchenExpansionCandidates } from '../../engine/changeRequests';

export default function ChangeRequestExplorer() {
  const model = useStore(state => state.model);
  const setPreview = useStore(state => state.setPreviewVariantModel);
  const applyVariant = useStore(state => state.applyVariant);
  const candidates = useMemo(() => generateKitchenExpansionCandidates(model, 3), [model]);

  return (
    <section className="space-y-3">
      <div className="rounded-xl border border-gray-200 bg-[#faf9f6] p-3">
        <div className="text-[10px] uppercase tracking-wider text-gray-400">Change request</div>
        <div className="mt-1 text-xs font-medium text-gray-900">Give the kitchen ~3 m² more area</div>
        <p className="mt-1 text-[11px] leading-4 text-gray-500">Nearby deterministic edits, ranked by semantic disruption. Not fresh floor-plan generation.</p>
      </div>
      {candidates.map((c, index) => (
        <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-semibold text-gray-900">{index + 1}. {c.name}</div>
            <div className="text-[10px] tabular-nums text-gray-500">distance {c.impact.distance.total.toFixed(2)}</div>
          </div>
          <p className="mt-1 text-[11px] text-gray-500">{c.summary}</p>
          <div className="mt-2 space-y-1">
            <div className="text-[10px] text-gray-600">{c.impact.hardConstraintsSatisfied ? '✓ hard constraints pass' : '⚠ hard constraint conflict'}</div>
            <div className="text-[10px] text-gray-600">{c.impact.protectedIntentPreserved}% protected intent preserved</div>
            {c.impact.impacts.slice(0,2).map((impact, i) => <div key={i} className="text-[10px] leading-4 text-gray-500">{impact.severity === 'CRITICAL' ? '⚠ ' : ''}{impact.message}</div>)}
          </div>
          <div className="mt-3 flex gap-1.5">
            <button onMouseEnter={() => setPreview(c.model)} onMouseLeave={() => setPreview(null)} onClick={() => setPreview(c.model)} className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-700">Preview</button>
            <button onClick={() => { applyVariant(c.model, 'option-a'); setPreview(null); }} className="rounded-md bg-gray-900 px-2 py-1 text-[10px] font-medium text-white">Apply</button>
          </div>
        </div>
      ))}
    </section>
  );
}
