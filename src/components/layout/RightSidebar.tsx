import ConstraintStatus from '../ui/ConstraintStatus';
import VariantExplorer from '../ui/VariantExplorer';
import ChangeLedger from '../ui/ChangeLedger';
import ClientView from '../ui/ClientView';
import { useStore } from '../../store/useStore';

export default function RightSidebar() {
  const clientViewMode = useStore(state => state.clientViewMode);

  if (clientViewMode) {
    return (
      <div className="w-96 h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto flex flex-col p-5 gap-6 relative z-50">
        <ClientView />
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto flex flex-col p-5 gap-6">
      <ChangeLedger />
      <ConstraintStatus />
      <VariantExplorer />
    </div>
  );
}
