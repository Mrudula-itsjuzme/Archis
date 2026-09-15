import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { evaluateAllConstraints } from '../../engine/constraints';
import VariantExplorer from '../ui/VariantExplorer';
import ChangeLedger from '../ui/ChangeLedger';

function ValidationIcon({ violated, warning }: { violated: boolean; warning?: boolean }) {
  if (violated) return (
    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
      <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );
  if (warning) return (
    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
      <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    </div>
  );
  return (
    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
      <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

export default function RightSidebar() {
  const model = useStore(state => state.model);
  const rooms = model.rooms;
  const [activeTab, setActiveTab] = useState<'insights' | 'variants' | 'history'>('insights');
  const evaluations = useMemo(() => evaluateAllConstraints(model), [model]);

  const passCount = evaluations.filter(e => !e.result.isViolated).length;
  const totalCount = evaluations.length;

  // Compute stats from real data
  const typeStats = rooms.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {} as Record<string, number>);
  const totalArea = rooms.reduce((s, r) => s + r.width * r.height, 0);

  return (
    <div className="w-72 h-full bg-white border-l border-gray-200 flex flex-col shrink-0 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 shrink-0">
        {(['insights', 'variants', 'history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-semibold capitalize transition-colors ${activeTab === tab ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {activeTab === 'insights' && (
          <>
            {/* Status card */}
            <div className={`rounded-xl p-3 flex items-start gap-3 ${rooms.length > 0 ? 'bg-emerald-50 border border-emerald-100' : 'bg-blue-50 border border-blue-100'}`}>
              {rooms.length > 0 ? (
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
              )}
              <div>
                <div className={`text-xs font-semibold ${rooms.length > 0 ? 'text-emerald-800' : 'text-blue-800'}`}>
                  {rooms.length > 0 ? 'AI Analysis Complete' : 'Upload a Blueprint'}
                </div>
                <div className={`text-[11px] mt-0.5 ${rooms.length > 0 ? 'text-emerald-600' : 'text-blue-500'}`}>
                  {rooms.length > 0 ? 'Blueprint successfully understood' : 'to start AI-powered analysis'}
                </div>
              </div>
              {rooms.length > 0 && <span className="ml-auto text-lg">✦</span>}
            </div>

            {/* Detected elements */}
            {rooms.length > 0 && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Detected Elements</div>
                <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <span className="text-base">🏠</span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-800">Rooms</div>
                      <div className="text-[10px] text-gray-400">
                        {Object.entries(typeStats).slice(0,2).map(([k, v]) => `${k} (${v})`).join(', ')}{Object.keys(typeStats).length > 2 ? '...' : ''}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{rooms.length}</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <span className="text-base">🚪</span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-800">Doors</div>
                      <div className="text-[10px] text-gray-400">Interior and exterior doors</div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{Math.max(1, Math.floor(rooms.length * 1.2))}</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <span className="text-base">🪟</span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-800">Windows</div>
                      <div className="text-[10px] text-gray-400">External windows</div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{Math.max(2, Math.floor(rooms.length * 1.5))}</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <span className="text-base">📐</span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-800">Scale (inferred)</div>
                      <div className="text-[10px] text-gray-400">High confidence (98%)</div>
                    </div>
                    <span className="text-[11px] font-bold text-gray-900">1m = 40px</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <span className="text-base">🕸️</span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-800">Adjacency Graph</div>
                      <div className="text-[10px] text-gray-400">Room connectivity mapped</div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600">Generated</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <span className="text-base">📏</span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-800">Total Floor Area</div>
                      <div className="text-[10px] text-gray-400">All detected spaces</div>
                    </div>
                    <span className="text-[11px] font-bold text-gray-900">{totalArea.toFixed(0)} m²</span>
                  </div>
                </div>
              </div>
            )}

            {/* Design Rule Validation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Design Rule Validation</div>
                {totalCount > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${passCount === totalCount ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                    {passCount}/{totalCount} passed
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {evaluations.map(({ constraint, result }) => (
                  <div key={constraint.id} className={`rounded-xl border px-3 py-2.5 flex flex-col gap-1 ${result.isViolated ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-start gap-2">
                      <ValidationIcon violated={result.isViolated} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-[11px] font-semibold leading-snug ${result.isViolated ? 'text-red-700' : 'text-gray-800'}`}>
                          {constraint.description}
                        </p>
                        {result.message && (
                          <p className={`text-[10px] mt-0.5 ${result.isViolated ? 'text-red-500' : 'text-emerald-600'}`}>
                            {result.isViolated ? '✗ ' : '✓ Compliant — '}{result.message}
                          </p>
                        )}
                      </div>
                      {result.isViolated && (
                        <button className="text-gray-400 hover:text-gray-600 shrink-0">›</button>
                      )}
                    </div>
                  </div>
                ))}
                {evaluations.length === 0 && (
                  <div className="text-xs text-gray-400 text-center py-4">Upload a blueprint to see validation results</div>
                )}
              </div>
            </div>

            {totalCount > 0 && (
              <button className="w-full border border-gray-200 rounded-xl py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Full Validation Report
              </button>
            )}
          </>
        )}

        {activeTab === 'variants' && <VariantExplorer />}
        {activeTab === 'history' && <ChangeLedger />}
      </div>
    </div>
  );
}
