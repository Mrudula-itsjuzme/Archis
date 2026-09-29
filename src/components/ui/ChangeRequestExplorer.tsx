import { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { generateKitchenExpansionCandidates } from '../../engine/changeRequests';

export default function ChangeRequestExplorer() {
  const model = useStore(state => state.model);
  const setPreview = useStore(state => state.setPreviewVariantModel);
  const applyVariant = useStore(state => state.applyVariant);
  const [targetDelta, setTargetDelta] = useState(3);
  const [pendingApplyId, setPendingApplyId] = useState<string | null>(null);

  const targetRoom = useMemo(() => model.rooms.find(room => room.id === 'kitchen') ||
    model.rooms.find(room => room.type === 'kitchen') ||
    [...model.rooms].sort((left, right) => (right.width * right.height) - (left.width * left.height))[0], [model.rooms]);

  const candidates = useMemo(() => targetRoom
    ? generateKitchenExpansionCandidates(model, targetDelta, targetRoom.id)
    : [], [model, targetRoom, targetDelta]);

  if (!targetRoom) return <div className="py-4 text-center text-xs text-gray-400">Add a rectangular space to review bounded change options.</div>;

  return (
    <section className="space-y-3">
      <div className="rounded-xl border border-gray-200 bg-[#faf9f6] p-3">
        <div className="text-[10px] uppercase tracking-wider text-gray-400">Bounded change request</div>
        <div className="mt-1 text-xs font-medium text-gray-900">Give {targetRoom.name} +{targetDelta} m²</div>
        <p className="mt-1 text-[11px] leading-4 text-gray-500">Three deterministic rectangle options for one named space. They are proposals to review, never an automatic floor-plan replacement.</p>
        <div className="mt-2 flex items-center gap-2">
          <label className="text-[10px] text-gray-500">+{targetDelta} m²</label>
          <input type="range" min="1" max="10" step="1" value={targetDelta} onChange={event => { setTargetDelta(parseInt(event.target.value, 10)); setPendingApplyId(null); }} className="h-1 flex-1 accent-gray-800" />
        </div>
      </div>

      {!candidates.length && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-4 text-amber-800">No bounded rectangular candidate is available for this space. Check that it has positive dimensions and use a whole-square-metre request between 1 and 10 m².</div>}

      {candidates.map((candidate, index) => {
        const isPending = pendingApplyId === candidate.id && candidate.readiness.ready;
        const constraintText = candidate.preservedConstraints.length
          ? `Preserved in the current hard-rule screen: ${candidate.preservedConstraints.join(' · ')}`
          : 'No applicable hard rule is asserted as preserved.';
        return (
          <div key={candidate.id} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-semibold text-gray-900">{index + 1}. {candidate.name}</div>
              <div className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${candidate.readiness.ready ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                {candidate.readiness.ready ? 'Ready for review' : 'Not ready to apply'}
              </div>
            </div>
            <p className="mt-1 text-[11px] text-gray-500">{candidate.summary}</p>
            <div className="mt-2 space-y-1 text-[10px] leading-4 text-gray-600">
              <div><span className="font-medium text-gray-700">Changes:</span> {candidate.whatChanges.join(' · ')}</div>
              <div><span className="font-medium text-gray-700">Why:</span> {candidate.why}</div>
              <div><span className="font-medium text-gray-700">Affected:</span> {candidate.affectedEntities.join(', ')}</div>
              <div><span className="font-medium text-gray-700">Constraints:</span> {constraintText}</div>
              <div><span className="font-medium text-gray-700">Confidence:</span> {candidate.confidence}</div>
              <div><span className="font-medium text-gray-700">Tradeoff:</span> {candidate.tradeoff}</div>
              <div className={candidate.readiness.ready ? 'text-emerald-700' : 'text-amber-800'}><span className="font-medium">Readiness:</span> {candidate.readiness.reason}</div>
              <div className="text-gray-400"><span className="font-medium text-gray-500">Provisional:</span> {candidate.provisionalNotes.join(' ')}</div>
              <div className="text-gray-400">Heuristic change distance: Δ {candidate.impact.distance.total.toFixed(2)}. This is a ranking aid, not a quality or compliance score.</div>
            </div>
            <div className="mt-3 flex gap-1.5">
              <button
                disabled={!candidate.readiness.ready}
                onMouseEnter={() => candidate.readiness.ready && setPreview(candidate.model)}
                onMouseLeave={() => setPreview(null)}
                onClick={() => candidate.readiness.ready && setPreview(candidate.model)}
                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >Preview</button>
              {isPending ? <>
                <button
                  onClick={() => { if (!candidate.readiness.ready) return; applyVariant(candidate.model, 'option-a'); setPreview(null); setPendingApplyId(null); }}
                  className="rounded-md bg-gray-900 px-2 py-1 text-[10px] font-medium text-white hover:bg-black"
                >Confirm apply</button>
                <button onClick={() => setPendingApplyId(null)} className="rounded-md px-2 py-1 text-[10px] font-medium text-gray-500 hover:text-gray-900">Cancel</button>
              </> : <button
                disabled={!candidate.readiness.ready}
                onClick={() => candidate.readiness.ready && setPendingApplyId(candidate.id)}
                className="rounded-md bg-gray-900 px-2 py-1 text-[10px] font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
              >Apply reviewed option</button>}
            </div>
          </div>
        );
      })}
    </section>
  );
}
