import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { evaluateAllConstraints } from '../../engine/constraints';

export default function ConstraintStatus() {
  const model = useStore(state => state.model);
  const evaluations = useMemo(() => evaluateAllConstraints(model), [model]);

  return (
    <div className="flex flex-col gap-3">
      {evaluations.map(({ constraint, result }) => (
        <div key={constraint.id} className={`p-4 draft-border bg-white transition-colors ${result.isViolated ? 'border-l-2 border-l-red-500' : 'border-l-2 border-l-[#2d4c3b]'}`}>
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${result.isViolated ? 'bg-red-500' : 'bg-[#2d4c3b]'}`} />
            <div>
              <p className={`text-sm ${result.isViolated ? 'text-red-700 font-medium' : 'text-[#2c2c2c] font-light'}`}>
                {constraint.description}
              </p>
              {result.isViolated && result.message && (
                <p className="text-red-500/80 text-[11px] font-mono mt-2 leading-relaxed">{result.message}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
