import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { generatePreserveVariant, generateMorePrivateVariant, generateMoreCompactVariant } from '../../engine/variants';

export default function VariantExplorer() {
  const { model, originalModel, applyVariant, activeVariant, resetModel } = useStore();
  const [showVariants, setShowVariants] = useState(false);
  
  const variants = [
    { id: 'original', name: 'Preserve Original', desc: 'Minimal adjustments to lock in current design.', ...generatePreserveVariant(originalModel) },
    { id: 'private', name: 'More Private', desc: 'Isolates bedrooms from living areas.', ...generateMorePrivateVariant(originalModel) },
    { id: 'compact', name: 'More Compact', desc: 'Reduces footprint and circulation.', ...generateMoreCompactVariant(originalModel) },
  ];

  if (!showVariants && activeVariant === 'original') {
    return (
      <button 
        onClick={() => setShowVariants(true)}
        className="w-full py-3 bg-[#3b5998] text-white text-[11px] uppercase tracking-widest font-mono hover:bg-[#2c4373] transition-colors"
      >
        Explore Alternatives
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {activeVariant !== 'original' && (
        <button 
          onClick={() => { resetModel(); setShowVariants(false); }}
          className="text-[11px] font-mono text-[#3b5998] hover:text-[#2c4373] flex items-center gap-2 self-start uppercase tracking-wider mb-2"
        >
          <span>&larr;</span> Revert to Draft
        </button>
      )}

      {variants.map(v => (
        <div 
          key={v.id} 
          onClick={() => applyVariant(v.model, v.id as any)}
          className={`p-4 bg-white cursor-pointer transition-all border ${
            activeVariant === v.id 
              ? 'border-[#3b5998] bg-[#3b5998]/[0.02]' 
              : 'border-[rgba(44,44,44,0.15)] hover:border-[#2c2c2c]/40'
          }`}
        >
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="font-medium text-sm text-[#2c2c2c]">{v.name}</h3>
            {activeVariant === v.id && <span className="text-[9px] uppercase font-mono tracking-widest text-[#3b5998]">Active</span>}
          </div>
          <p className="text-[11px] text-[#2c2c2c]/50 mb-3">{v.desc}</p>
          
          <div className="pt-3 border-t border-[rgba(44,44,44,0.05)] space-y-1.5">
            {v.stats.circulationAreaChange !== 0 && (
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-[#2c2c2c]/40 uppercase tracking-wider">Circulation</span>
                <span className={v.stats.circulationAreaChange < 0 ? 'text-[#2d4c3b]' : 'text-orange-600'}>
                  {v.stats.circulationAreaChange > 0 ? '+' : ''}{v.stats.circulationAreaChange} m²
                </span>
              </div>
            )}
            {v.stats.bedroomAreaChange !== 0 && (
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-[#2c2c2c]/40 uppercase tracking-wider">Bedrooms</span>
                <span className={v.stats.bedroomAreaChange > 0 ? 'text-[#2d4c3b]' : 'text-[#2c2c2c]/70'}>
                  {v.stats.bedroomAreaChange > 0 ? '+' : ''}{v.stats.bedroomAreaChange} m²
                </span>
              </div>
            )}
            <div className="text-[10px] font-mono text-[#2c2c2c]/60 leading-relaxed mt-2">
              <span className="text-[#2c2c2c]/40 uppercase tracking-wider block mb-1">Preserved</span>
              {v.stats.preservedAdjacencies.join(' · ')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
