import { create } from 'zustand';
import { SemanticModel, Room, VariantType } from '../models/types';
import { initialModel } from './initialData';

interface StoreState {
  model: SemanticModel;
  originalModel: SemanticModel;
  activeVariant: VariantType;
  updateRoomPosition: (id: string, x: number, y: number) => void;
  updateRoomDimensions: (id: string, width: number, height: number) => void;
  resetModel: () => void;
  applyVariant: (variantModel: SemanticModel, variantType: VariantType) => void;
}

export const useStore = create<StoreState>((set) => ({
  model: JSON.parse(JSON.stringify(initialModel)),
  originalModel: JSON.parse(JSON.stringify(initialModel)),
  activeVariant: 'original',
  
  updateRoomPosition: (id, x, y) => set((state) => {
    const rooms = state.model.rooms.map(r => r.id === id ? { ...r, x, y } : r);
    return { model: { ...state.model, rooms } };
  }),
  
  updateRoomDimensions: (id, width, height) => set((state) => {
    const rooms = state.model.rooms.map(r => r.id === id ? { ...r, width, height } : r);
    return { model: { ...state.model, rooms } };
  }),
  
  resetModel: () => set((state) => ({
    model: JSON.parse(JSON.stringify(state.originalModel)),
    activeVariant: 'original'
  })),
  
  applyVariant: (variantModel, variantType) => set({
    model: JSON.parse(JSON.stringify(variantModel)),
    activeVariant: variantType
  }),
}));
