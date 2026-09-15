import React from 'react';
import ConstraintStatus from '../ui/ConstraintStatus';
import VariantExplorer from '../ui/VariantExplorer';

export default function Sidebar() {
  return (
    <div className="w-[340px] h-full draft-border panel-bg flex flex-col z-10 shrink-0">
      <div className="p-8 draft-border border-b border-t-0 border-l-0 border-r-0">
        <h1 className="text-xl font-medium tracking-tight flex items-center gap-2">
          <div className="w-3 h-3 bg-[#3b5998] rounded-full"></div>
          Archis
        </h1>
        <p className="text-[10px] text-[#2c2c2c]/50 mt-2 uppercase tracking-[0.2em] font-mono">Semantic Design Tool</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-10">
        <section>
          <h2 className="text-xs uppercase tracking-widest text-[#2c2c2c]/40 font-semibold mb-5 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-[#2c2c2c]/20"></span> Constraints
          </h2>
          <ConstraintStatus />
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-widest text-[#2c2c2c]/40 font-semibold mb-5 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-[#2c2c2c]/20"></span> Exploration
          </h2>
          <VariantExplorer />
        </section>
      </div>
      
      <div className="p-4 draft-border border-t border-b-0 border-l-0 border-r-0 text-[#2c2c2c]/30">
        <p className="text-[10px] text-center font-mono uppercase tracking-widest">Active Model</p>
      </div>
    </div>
  );
}
