import ConstraintStatus from '../ui/ConstraintStatus';
import VariantExplorer from '../ui/VariantExplorer';
import ChangeLedger from '../ui/ChangeLedger';
import ClientView from '../ui/ClientView';
import { useStore } from '../../store/useStore';

export default function RightSidebar() {
  const clientViewMode = useStore(state => state.clientViewMode);

  if (clientViewMode) {
    return (
      <div className="w-96 h-full bg-white border-l overflow-y-auto flex flex-col p-5 shadow-lg relative z-50">
        <ClientView />
      </div>
    );
  }

  return (
    <div className="w-80 h-full panel-bg draft-border border-l overflow-y-auto flex flex-col p-5 gap-6">
      <ChangeLedger />
      <ConstraintStatus />
      <VariantExplorer />
    </div>
  );
}
