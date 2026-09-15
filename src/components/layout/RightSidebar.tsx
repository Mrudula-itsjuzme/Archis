import { useState } from 'react';
import VariantExplorer from '../ui/VariantExplorer';
import ChangeLedger from '../ui/ChangeLedger';
import ClientView from '../ui/ClientView';
import IntentPanel from '../ui/IntentPanel';
import { useStore } from '../../store/useStore';

export default function RightSidebar() {
  const clientViewMode = useStore(state => state.clientViewMode);
  const [activeTab, setActiveTab] = useState<'intent' | 'variants' | 'history'>('intent');

  if (clientViewMode) return <div className="w-96 h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto flex flex-col p-5 gap-6 relative z-50"><ClientView /></div>;

  return (
    <div className="w-80 h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="flex p-2 shrink-0">
        <div className="flex w-full bg-gray-100/80 p-1 rounded-lg border border-gray-200/50">
          {(['intent','variants','history'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab === 'intent' ? 'Intent' : tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 gap-6 flex flex-col">
        {activeTab === 'intent' && <IntentPanel />}
        {activeTab === 'variants' && <VariantExplorer />}
        {activeTab === 'history' && <ChangeLedger />}
      </div>
    </div>
  );
}
