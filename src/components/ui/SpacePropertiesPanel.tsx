import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Space } from '../../models/types';

const SPACE_TYPES = [
  'living', 'kitchen', 'bedroom', 'bathroom', 'circulation', 
  'office', 'classroom', 'lab', 'corridor', 'courtyard', 
  'stair', 'retail', 'utility', 'lobby', 'outdoor'
];

export default function SpacePropertiesPanel() {
  const selectedSpaceId = useStore(s => s.selectedSpaceId);
  const model = useStore(s => s.model);
  const updateDimensions = useStore(s => s.updateSpaceDimensions);
  
  const space = model.rooms.find(r => r.id === selectedSpaceId);

  // We need an update type action, let's just do a manual state mutation via a new action or existing one.
  const updateSpace = (updates: Partial<Space>) => {
    useStore.setState(state => {
      const newModel = { ...state.model };
      newModel.rooms = newModel.rooms.map(r => r.id === selectedSpaceId ? { ...r, ...updates } : r);
      return { model: newModel };
    });
  };

  if (!space) return null;

  return (
    <div className="bg-white border border-indigo-200 rounded-xl overflow-hidden shadow-sm mb-4">
      <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center justify-between">
        <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wide">Space Properties</h3>
        <button 
          onClick={() => useStore.getState().setSelectedSpaceId(null)}
          className="text-indigo-400 hover:text-indigo-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Name</label>
          <input 
            type="text" 
            value={space.name} 
            onChange={e => updateSpace({ name: e.target.value })}
            className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded focus:border-indigo-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Type</label>
          <select 
            value={space.type}
            onChange={e => updateSpace({ type: e.target.value as any })}
            className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded focus:border-indigo-500 outline-none bg-white"
          >
            {SPACE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Width (m)</label>
            <input 
              type="number" 
              step="0.1"
              value={space.width.toFixed(2)} 
              onChange={e => updateDimensions(space.id, parseFloat(e.target.value) || space.width, space.height)}
              className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Height (m)</label>
            <input 
              type="number" 
              step="0.1"
              value={space.height.toFixed(2)} 
              onChange={e => updateDimensions(space.id, space.width, parseFloat(e.target.value) || space.height)}
              className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-2 mt-1 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <span>Area:</span>
          <span className="font-bold text-gray-900">{(space.width * space.height).toFixed(1)} m²</span>
        </div>
        
        <button 
          onClick={() => {
            useStore.setState(state => {
              const newModel = { ...state.model };
              newModel.rooms = newModel.rooms.filter(r => r.id !== selectedSpaceId);
              return { model: newModel, selectedSpaceId: null };
            });
          }}
          className="mt-2 w-full py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-colors"
        >
          Delete Space
        </button>
      </div>
    </div>
  );
}
