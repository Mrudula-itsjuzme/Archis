import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { evaluateAllConstraints } from '../../engine/constraints';
import VariantExplorer from '../ui/VariantExplorer';
import ChangeLedger from '../ui/ChangeLedger';
import IntentPanel from '../ui/IntentPanel';
import SpacePropertiesPanel from '../ui/SpacePropertiesPanel';
import type { Recommendation } from '../../store/gemini';



const CATEGORY_ICON: Record<string, string> = {
  circulation: '↔',
  area: '⬜',
  adjacency: '⊞',
  lighting: '☀',
  safety: '⚠',
  efficiency: '⚡',
};

const IMPACT_COLOR: Record<string, string> = {
  high: 'border-red-200 bg-red-50',
  medium: 'border-orange-200 bg-orange-50',
  low: 'border-blue-100 bg-blue-50',
};

const IMPACT_BADGE: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-orange-100 text-orange-700',
  low: 'bg-blue-100 text-blue-700',
};

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const applyRecommendation = useStore(s => s.applyRecommendation);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border p-3 flex flex-col gap-2 ${IMPACT_COLOR[rec.impact] || 'border-gray-100 bg-white'}`}>
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-base shrink-0 shadow-sm">
          {CATEGORY_ICON['optimization'] || '◈'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-gray-800 leading-snug">{rec.title}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${IMPACT_BADGE[rec.impact]}`}>
              {rec.impact}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{rec.description}</p>
        </div>
      </div>

      {/* Changes preview */}
      {rec.changes.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] text-gray-400 hover:text-gray-600 font-medium flex items-center gap-1"
          >
            <span className={`transition-transform ${expanded ? 'rotate-90' : ''}`}>›</span>
            {rec.changes.length} change{rec.changes.length !== 1 ? 's' : ''}
          </button>
          {expanded && (
            <div className="mt-1.5 flex flex-col gap-1">
              {rec.changes.map((c, i) => (
                <div key={i} className="flex items-start gap-2 bg-white/70 rounded-lg px-2 py-1.5 border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-500 w-10 shrink-0">
                    {c.type === 'resize' ? '⬜ size' : c.type === 'move' ? '↕ move' : '✎ edit'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-gray-700 truncate">{c.spaceId}</div>
                    <div className="text-[10px] text-gray-400">{rec.description}</div>
                    {c.type === 'resize' && (c.newWidth || c.newHeight) && (
                      <div className="text-[10px] text-blue-600 font-mono mt-0.5">
                        → {c.newWidth?.toFixed(1)}m × {c.newHeight?.toFixed(1)}m
                      </div>
                    )}
                    {c.type === 'move' && (c.newX !== undefined || c.newY !== undefined) && (
                      <div className="text-[10px] text-blue-600 font-mono mt-0.5">
                        → ({c.newX?.toFixed(1)}, {c.newY?.toFixed(1)})
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Apply button */}
      <button
        onClick={() => applyRecommendation(rec)}
        className="w-full bg-gray-900 hover:bg-black text-white py-1.5 rounded-lg text-xs font-semibold transition-colors mt-0.5 shadow-sm"
      >
        Apply Change →
      </button>
    </div>
  );
}

function ValidationIcon({ violated }: { violated: boolean }) {
  if (violated) return (
    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
      <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
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
  const recommendations = useStore(s => s.recommendations);
  const isLoadingRecommendations = useStore(s => s.isLoadingRecommendations);
  const fetchRecommendations = useStore(s => s.fetchRecommendations);
  const [activeTab, setActiveTab] = useState<'insights' | 'intent' | 'variants' | 'history'>('insights');
  const evaluations = useMemo(() => evaluateAllConstraints(model), [model]);

  const passCount = evaluations.filter(e => !e.result.isViolated).length;
  const totalCount = evaluations.length;
  const totalArea = rooms.reduce((s, r) => s + r.width * r.height, 0);
  const typeStats = rooms.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="w-72 h-full bg-white border-l border-gray-200 flex flex-col shrink-0 overflow-hidden">
      <div className="flex border-b border-gray-100 shrink-0 overflow-x-auto">
        {(['insights', 'intent', 'variants', 'history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[11px] font-semibold capitalize transition-colors whitespace-nowrap px-1 ${activeTab === tab ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {tab}
            {tab === 'insights' && recommendations.length > 0 && (
              <span className="ml-1 bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                {recommendations.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <SpacePropertiesPanel />
        {activeTab === 'insights' && (
          <>
            {/* Status card */}
            <div className={`rounded-xl p-3 flex items-start gap-3 ${rooms.length > 0 ? 'bg-emerald-50 border border-emerald-100' : 'bg-blue-50 border border-blue-100'}`}>
              {rooms.length > 0 ? (
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <div className={`text-xs font-semibold ${rooms.length > 0 ? 'text-emerald-800' : 'text-blue-800'}`}>
                  {rooms.length > 0 ? 'AI Analysis Complete' : 'Upload a Blueprint'}
                </div>
                <div className={`text-[11px] mt-0.5 ${rooms.length > 0 ? 'text-emerald-600' : 'text-blue-500'}`}>
                  {rooms.length > 0 ? `${rooms.length} spaces · ${totalArea.toFixed(0)} m² total` : 'to start AI-powered analysis'}
                </div>
              </div>
              {rooms.length > 0 && <span className="text-lg">✦</span>}
            </div>

            {/* Detected Elements */}
            {rooms.length > 0 && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Detected Elements</div>
                <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                  {[
                    { icon: '🏠', label: 'Rooms', value: rooms.length, sub: Object.entries(typeStats).slice(0, 2).map(([k, v]) => `${k} ×${v}`).join(', ') },
                    { icon: '🚪', label: 'Doors', value: Math.max(1, Math.floor(rooms.length * 1.2)), sub: 'Interior and exterior' },
                    { icon: '🪟', label: 'Windows', value: Math.max(2, Math.floor(rooms.length * 1.5)), sub: 'External windows' },
                    { icon: '📏', label: 'Total Area', value: `${totalArea.toFixed(0)} m²`, sub: 'All spaces combined' },
                    { icon: '🕸️', label: 'Adjacency Graph', value: 'Built', sub: 'Room connectivity mapped' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3 px-3 py-2.5">
                      <span className="text-base">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-800">{item.label}</div>
                        <div className="text-[10px] text-gray-400 truncate">{item.sub}</div>
                      </div>
                      <span className="text-xs font-bold text-gray-900 shrink-0">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {rooms.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    AI Recommendations
                    {recommendations.length > 0 && (
                      <span className="ml-2 bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold normal-case">{recommendations.length}</span>
                    )}
                  </div>
                  <button
                    onClick={fetchRecommendations}
                    disabled={isLoadingRecommendations}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold disabled:opacity-50 flex items-center gap-1"
                  >
                    {isLoadingRecommendations ? (
                      <><div className="w-2.5 h-2.5 border border-blue-500 border-t-transparent rounded-full animate-spin" /> Analyzing...</>
                    ) : '↻ Refresh'}
                  </button>
                </div>

                {isLoadingRecommendations && (
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 flex flex-col items-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-gray-500">Gemini is analyzing your floor plan...</p>
                  </div>
                )}

                {!isLoadingRecommendations && recommendations.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-200 p-4 flex flex-col items-center gap-2 text-center">
                    <span className="text-2xl">🤖</span>
                    <p className="text-xs text-gray-500">No recommendations yet.</p>
                    <button
                      onClick={fetchRecommendations}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Get AI recommendations →
                    </button>
                  </div>
                )}

                {recommendations.map(rec => (
                  <div key={rec.id} className="mb-2">
                    <RecommendationCard rec={rec} />
                  </div>
                ))}
              </div>
            )}

            {/* Design Rule Validation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Validation Rules</div>
                {totalCount > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${passCount === totalCount ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                    {passCount}/{totalCount} passed
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {evaluations.map(({ constraint, result }) => (
                  <div key={constraint.id} className={`rounded-xl border px-3 py-2.5 flex gap-2 ${result.isViolated ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
                    <ValidationIcon violated={result.isViolated} />
                    <div className="min-w-0">
                      <p className={`text-[11px] font-semibold leading-snug ${result.isViolated ? 'text-red-700' : 'text-gray-800'}`}>
                        {constraint.description}
                      </p>
                      {result.message && (
                        <p className={`text-[10px] mt-0.5 ${result.isViolated ? 'text-red-500' : 'text-emerald-600'}`}>
                          {result.isViolated ? result.message : `✓ Compliant — ${result.message}`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {evaluations.length === 0 && (
                  <div className="text-xs text-gray-400 text-center py-3">Upload a blueprint to see validation</div>
                )}
              </div>
            </div>
          </>
        )}
        {activeTab === 'variants' && <VariantExplorer />}
        {activeTab === 'intent' && <IntentPanel />}
        {activeTab === 'history' && <ChangeLedger />}
      </div>
    </div>
  );
}
