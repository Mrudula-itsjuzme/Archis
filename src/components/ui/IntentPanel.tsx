import IntentInspector from './IntentInspector';
import ConstraintStatus from './ConstraintStatus';
import { useStore } from '../../store/useStore';
import { IntentDecision } from '../../models/types';
import { inferIntentHypotheses } from '../../engine/intent';

export default function IntentPanel() {
  const model = useStore(state => state.model);

  const setDecision = (id: string, decision: IntentDecision) => {
    useStore.setState(state => ({
      model: {
        ...state.model,
        intentHypotheses: (state.model.intentHypotheses?.length ? state.model.intentHypotheses : inferIntentHypotheses(state.model))
          .map(h => h.id === id ? { ...h, decision } : h)
      }
    }));
  };

  return (
    <div className="space-y-6">
      <IntentInspector model={model} onDecision={setDecision} />
      <div className="border-t border-gray-100 pt-5">
        <ConstraintStatus />
      </div>
    </div>
  );
}
