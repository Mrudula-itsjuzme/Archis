import { useStore } from '../../store/useStore';

export default function ClientView() {
  const { changeLedger, activeVariant } = useStore();

  const activeOption = activeVariant === 'original' ? 'Baseline Design' : 
                       activeVariant === 'private' ? 'Option B: More Privacy' : 
                       activeVariant === 'compact' ? 'Option C: Compact Footprint' : 'Current Design';

  const latestEvent = changeLedger[0];

  return (
    <div className="flex flex-col h-full gap-6 p-2">
      <div>
        <h2 className="text-xl font-light text-gray-800 mb-1">{activeOption}</h2>
        <p className="text-sm text-gray-500">Client Presentation View</p>
      </div>

      <div className="bg-[#f8f9fa] rounded p-5 border border-gray-100">
        <h3 className="text-sm font-medium mb-3">What changed</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {latestEvent 
            ? `We adjusted the ${latestEvent.description.replace('YOU MOVED ', '').toLowerCase()} to explore alternative layouts.`
            : 'You are viewing the baseline architectural design.'}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="border-l-2 border-green-500 pl-4">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-green-700 mb-2">Benefits</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            {activeVariant === 'private' ? (
              <>
                <li>Greater separation from social spaces</li>
                <li>Bedroom area preserved</li>
              </>
            ) : activeVariant === 'compact' ? (
              <>
                <li>Reduced circulation area</li>
                <li>More efficient footprint</li>
              </>
            ) : (
              <li>Balanced spatial relationships</li>
            )}
          </ul>
        </div>

        {activeVariant !== 'original' && (
          <div className="border-l-2 border-orange-400 pl-4">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-orange-700 mb-2">Trade-offs</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              {activeVariant === 'private' ? (
                <li>+1.8 m² additional circulation</li>
              ) : activeVariant === 'compact' ? (
                <li>Smaller primary bedrooms</li>
              ) : null}
            </ul>
          </div>
        )}

        <div className="border-l-2 border-gray-300 pl-4 mt-2">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Unchanged</h3>
          <ul className="text-sm text-gray-500 space-y-1">
            <li className="flex items-center gap-2">✓ <span>Kitchen remains connected to living</span></li>
            <li className="flex items-center gap-2">✓ <span>Courtyard remains central</span></li>
            <li className="flex items-center gap-2">✓ <span>Bedroom minimum areas remain valid</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
