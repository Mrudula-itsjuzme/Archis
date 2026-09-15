import { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { generateKitchenExpansionCandidates } from '../../engine/changeRequests';

export default function ChangeRequestExplorer() {
  const model = useStore(state => state.model);
  const setPreview = useStore(state => state.setPreviewVariantModel);
  const applyVariant = useStore(state => state.applyVariant);
  const [targetDelta, setTargetDelta] = useState(3);

  // Find a suitable room to expand (kitchen if present, otherwise largest room)
  const targetRoom = useMemo(() => {
    return model.rooms.find(r => r.id === 'kitchen') ||
      model.rooms.find(r => r.type === 'kitchen') ||
      [...model.rooms].sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
  }, [model.rooms]);

  const candidates = useMemo(() => {
    if (!targetRoom) return [];
    // temporarily patch the model so the engine finds the right room
    const patchedModel = { ...model, rooms: model.rooms.map(r => r.id === targetRoom.id ? { ...r, id: 'kitchen' } : r) };
    patchedModel.project = JSON.parse(JSON.stringify(model.project));
    for (const b of patchedModel.project.buildings) for (const l of b.levels) {
      l.spaces = l.spaces.map(s => s.id === targetRoom.id ? { ...s, id: 'kitchen' } : s);
    }
    const result = generateKitchenExpansionCandidates(patchedModel, targetDelta);
    // restore real IDs
    return result.map(c => ({
      ...c,
      model: {
        ...c.model,
        rooms: c.model.rooms.map(r => r.id === 'kitchen' ? { ...r, id: targetRoom.id } : r),
        project: (() => {
          const proj = JSON.parse(JSON.stringify(c.model.project));
          for (const b of proj.buildings) for (const l of b.levels) {
            l.spaces = l.spaces.map((s: any) => s.id === 'kitchen' ? { ...s, id: targetRoom.id } : s);
          }
          return proj;
        })()
      }
    }));
  }, [model, targetRoom, targetDelta]);

  if (!targetRoom) return <div className="text-xs text-gray-400 text-center py-4">Upload a blueprint to see change candidates</div>;

  return (
    <section className="space-y-3">
      <div className="rounded-xl border border-gray-200 bg-[#faf9f6] p-3">
        <div className="text-[10px] uppercase tracking-wider text-gray-400">Change request</div>
        <div className="mt-1 text-xs font-medium text-gray-900">Give the {targetRoom.name} more area</div>
        <p className="mt-1 text-[11px] leading-4 text-gray-500">Minimal-change candidates ranked by semantic disruption. Not a full floor-plan regeneration.</p>
        <div className="mt-2 flex items-center gap-2">
          <label className="text-[10px] text-gray-500">+{targetDelta} m²</label>
          <input type="range" min="1" max="10" value={targetDelta} onChange={e => setTargetDelta(parseInt(e.target.value))} className="flex-1 h-1 accent-gray-800" />
        </div>
      </div>
      {candidates.map((c, index) => (
        <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-semibold text-gray-900">{index + 1}. {c.name}</div>
            <div className={`text-[10px] tabular-nums font-medium px-1.5 py-0.5 rounded-full ${c.impact.distance.total < 0.15 ? 'bg-emerald-100 text-emerald-700' : c.impact.distance.total < 0.35 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
              Δ {c.impact.distance.total.toFixed(2)}
            </div>
          </div>
          <p className="mt-1 text-[11px] text-gray-500">{c.summary}</p>
          <div className="mt-2 space-y-0.5">
            <div className="text-[10px] text-gray-600">{c.impact.hardConstraintsSatisfied ? '✓ hard constraints pass' : '⚠ hard constraint conflict'}</div>
            <div className="text-[10px] text-gray-600">{c.impact.protectedIntentPreserved}% protected intent preserved</div>
            {c.impact.impacts.slice(0, 2).map((impact, i) => (
              <div key={i} className={`text-[10px] leading-4 ${impact.severity === 'CRITICAL' ? 'text-red-500' : impact.severity === 'WARNING' ? 'text-orange-500' : 'text-gray-400'}`}>
                {impact.severity !== 'INFO' ? '⚠ ' : ''}{impact.message}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-1.5">
            <button
              onMouseEnter={() => setPreview(c.model)}
              onMouseLeave={() => setPreview(null)}
              onClick={() => setPreview(c.model)}
              className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-700 hover:bg-gray-50"
            >Preview</button>
            <button
              onClick={() => { applyVariant(c.model, 'option-a'); setPreview(null); }}
              className="rounded-md bg-gray-900 px-2 py-1 text-[10px] font-medium text-white hover:bg-black"
            >Apply</button>
          </div>
        </div>
      ))}
    </section>
  );
}
