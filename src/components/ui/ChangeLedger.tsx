import { useStore } from '../../store/useStore';

export default function ChangeLedger() {
  const { changeLedger } = useStore();

  if (changeLedger.length === 0) {
    return (
      <div className="flex flex-col h-full gap-4 opacity-50">
        <h2 className="text-xs uppercase tracking-[0.2em] font-mono text-[#3b5998]">Semantic Ledger</h2>
        <div className="text-xs font-light italic">Make an edit in 2D or 3D to see structural propagation.</div>
      </div>
    );
  }

  const latestEvent = changeLedger[0];

  return (
    <div className="flex flex-col h-full gap-4">
      <h2 className="text-xs uppercase tracking-[0.2em] font-mono text-[#3b5998]">Semantic Ledger</h2>
      
      <div className="bg-white draft-border p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">Latest Change</div>
        <div className="text-sm font-semibold mb-4">{latestEvent.description}</div>
        
        <div className="grid grid-cols-1 gap-3 text-xs">
          {latestEvent.details.map((detail, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400">{detail.category}</span>
              <div className="flex justify-between items-end">
                <span className="text-gray-700">{detail.message}</span>
                {(detail.metric || detail.delta) && (
                  <span className="font-mono text-gray-900 ml-2 text-right">
                    {detail.delta && <span className={detail.delta.startsWith('+') ? 'text-blue-600' : 'text-red-600'}>{detail.delta} </span>}
                    {detail.metric}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
