import { useMemo, useState } from 'react';
import { IntentDecision, IntentHypothesis, SemanticModel } from '../../models/types';
import { inferIntentHypotheses } from '../../engine/intent';

interface Props {
  model?: SemanticModel;
  onDecision?: (id: string, decision: IntentDecision) => void;
}

export default function IntentInspector({ model, onDecision }: Props) {
  const inferred = useMemo(() => model ? (model.intentHypotheses?.length ? model.intentHypotheses : inferIntentHypotheses(model)) : [], [model]);
  const [local, setLocal] = useState<Record<string, IntentDecision>>({});

  if (!model) return <div className="text-xs text-gray-500">Intent hypotheses appear once a semantic draft is loaded.</div>;

  const decide = (h: IntentHypothesis, decision: IntentDecision) => {
    setLocal(s => ({ ...s, [h.id]: decision }));
    onDecision?.(h.id, decision);
  };

  return (
    <section className="space-y-3">
      <div>
        <div className="text-xs font-semibold text-gray-900">What Archis thinks matters</div>
        <p className="mt-1 text-[11px] leading-4 text-gray-500">Hypotheses, not facts. Confirm what should survive the next revision.</p>
      </div>
      {inferred.map(h => {
        const decision = local[h.id] ?? h.decision;
        return (
          <div key={h.id} className="rounded-xl border border-gray-200 bg-[#faf9f6] p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="text-xs font-medium text-gray-900">{h.label}</div>
              <div className="text-[10px] tabular-nums text-gray-500">{Math.round(h.confidence * 100)}%</div>
            </div>
            <p className="mt-1 text-[11px] leading-4 text-gray-600">{h.description}</p>
            <p className="mt-2 text-[10px] leading-4 text-gray-400">Why: {h.rationale}</p>
            <div className="mt-3 flex gap-1.5">
              <button onClick={() => decide(h, 'PROTECT')} className={`rounded-md px-2 py-1 text-[10px] font-medium ${decision === 'PROTECT' ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-600'}`}>Protect</button>
              <button onClick={() => decide(h, 'IGNORE')} className={`rounded-md px-2 py-1 text-[10px] font-medium ${decision === 'IGNORE' ? 'bg-gray-200 text-gray-900' : 'border border-gray-200 bg-white text-gray-600'}`}>Incidental</button>
            </div>
          </div>
        );
      })}
    </section>
  );
}
