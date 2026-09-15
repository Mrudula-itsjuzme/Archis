import { useState } from 'react';
import ConstraintStatus from '../ui/ConstraintStatus';
import VariantExplorer from '../ui/VariantExplorer';
import ChangeLedger from '../ui/ChangeLedger';
import ClientView from '../ui/ClientView';
import { useStore } from '../../store/useStore';

export default function RightSidebar() {
  const clientViewMode = useStore(state => state.clientViewMode);
  const [activeTab, setActiveTab] = useState<'insights' | 'variants' | 'history'>('insights');

  if (clientViewMode) {
    return (
      <div className="w-96 h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto flex flex-col p-5 gap-6 relative z-50">
        <ClientView />
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="flex p-2 shrink-0">
        <div className="flex w-full bg-gray-100/80 p-1 rounded-lg border border-gray-200/50">
          <button 
            onClick={() => setActiveTab('insights')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'insights' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Insights
          </button>
          <button 
            onClick={() => setActiveTab('variants')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'variants' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Variants
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            History
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 gap-6 flex flex-col">
        {activeTab === 'insights' && (
          <ConstraintStatus />
        )}
        {activeTab === 'variants' && (
          <VariantExplorer />
        )}
        {activeTab === 'history' && (
          <ChangeLedger />
        )}
      </div>
    </div>
  );
}
