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
      <div className="flex border-b border-gray-100 shrink-0">
        <button 
          onClick={() => setActiveTab('insights')}
          className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors ${activeTab === 'insights' ? 'border-[#3b5998] text-[#3b5998]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Insights
        </button>
        <button 
          onClick={() => setActiveTab('variants')}
          className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors ${activeTab === 'variants' ? 'border-[#3b5998] text-[#3b5998]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Variants
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-[#3b5998] text-[#3b5998]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          History
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 gap-6 flex flex-col">
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
