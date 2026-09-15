import { create } from 'zustand';
import { SemanticModel, Space, VariantType, ChangeEvent, Project } from '../models/types';
import { initialModel, courtyardHouseProject, apartmentFloorProject, schoolWingProject } from './initialData';

interface StoreState {
  model: SemanticModel;
  originalModel: SemanticModel;
  
  // UI State
  activeLevelId: string | null;
  selectedSpaceId: string | null;
  hoveredSpaceId: string | null;
  clientViewMode: boolean;
  setClientViewMode: (enabled: boolean) => void;
  workspaceMode: 'plan' | '3d' | 'split';
  setWorkspaceMode: (mode: 'plan' | '3d' | 'split') => void;
  setSelectedSpaceId: (id: string | null) => void;
  setHoveredSpaceId: (id: string | null) => void;
  
  // Ledger
  changeLedger: ChangeEvent[];
  addChangeEvent: (event: ChangeEvent) => void;

  // Blueprint
  blueprintUrl: string | null;
  blueprintOpacity: number;
  blueprintScale: number; // Pixels per meter
  blueprintRotation: number;
  blueprintOffsetX: number;
  blueprintOffsetY: number;
  blueprintLocked: boolean;
  setBlueprintConfig: (config: Partial<{
    url: string | null;
    opacity: number;
    scale: number;
    rotation: number;
    offsetX: number;
    offsetY: number;
    locked: boolean;
  }>) => void;
  
  // Variants
  activeVariant: VariantType;
  previewVariantModel: SemanticModel | null;
  setPreviewVariantModel: (model: SemanticModel | null) => void;
  
  // Actions
  loadProject: (project: Project) => void;
  updateSpacePosition: (id: string, x: number, y: number) => void;
  updateSpaceDimensions: (id: string, width: number, height: number) => void;
  resetModel: () => void;
  applyVariant: (variantModel: SemanticModel, variantType: VariantType) => void;
}

// Helper to sync legacy fields with actual project hierarchy
const syncLegacyFields = (model: SemanticModel): SemanticModel => {
  const newModel = { ...model };
  for (const b of newModel.project.buildings) {
    for (const l of b.levels) {
      if (l.id === newModel.activeLevelId) {
        newModel.rooms = [...l.spaces];
        newModel.doors = [...l.doors];
        newModel.furniture = [...l.furniture];
        return newModel;
      }
    }
  }
  return newModel;
};

export const useStore = create<StoreState>((set) => ({
  model: JSON.parse(JSON.stringify(initialModel)),
  originalModel: initialModel,
  
  activeLevelId: null,
  selectedSpaceId: null,
  hoveredSpaceId: null,
  setSelectedSpaceId: (id) => set({ selectedSpaceId: id }),
  setHoveredSpaceId: (id) => set({ hoveredSpaceId: id }),

  clientViewMode: false,
  workspaceMode: "split",
  setWorkspaceMode: (mode) => set({ workspaceMode: mode }),
  setClientViewMode: (enabled) => set({ clientViewMode: enabled }),
  
  changeLedger: [],
  addChangeEvent: (event) => set((state) => ({ changeLedger: [event, ...state.changeLedger] })),

  blueprintUrl: null,
  blueprintOpacity: 0.4,
  blueprintScale: 40,
  blueprintRotation: 0,
  blueprintOffsetX: 100,
  blueprintOffsetY: 100,
  blueprintLocked: false,
  setBlueprintConfig: (config) => set((state) => ({
    blueprintUrl: config.url !== undefined ? config.url : state.blueprintUrl,
    blueprintOpacity: config.opacity !== undefined ? config.opacity : state.blueprintOpacity,
    blueprintScale: config.scale !== undefined ? config.scale : state.blueprintScale,
    blueprintRotation: config.rotation !== undefined ? config.rotation : state.blueprintRotation,
    blueprintOffsetX: config.offsetX !== undefined ? config.offsetX : state.blueprintOffsetX,
    blueprintOffsetY: config.offsetY !== undefined ? config.offsetY : state.blueprintOffsetY,
    blueprintLocked: config.locked !== undefined ? config.locked : state.blueprintLocked,
  })),
  
  activeVariant: "original",
  previewVariantModel: null,
  setPreviewVariantModel: (model) => set({ previewVariantModel: model }),

  loadProject: (project) => set(() => {
    const newModel: SemanticModel = {
      project,
      activeLevelId: project.buildings[0].levels[0].id,
      rooms: project.buildings[0].levels[0].spaces,
      doors: project.buildings[0].levels[0].doors,
      furniture: project.buildings[0].levels[0].furniture,
    };
    return {
      model: JSON.parse(JSON.stringify(newModel)),
      originalModel: newModel,
      activeVariant: "original",
  previewVariantModel: null,
  setPreviewVariantModel: (model) => set({ previewVariantModel: model }),
      changeLedger: [],
      activeLevelId: null,
  selectedSpaceId: null,
      hoveredSpaceId: null
    };
  }),

  updateSpacePosition: (id, x, y) => set((state) => {
    const newModel = JSON.parse(JSON.stringify(state.model)) as SemanticModel;
    let spaceName = 'Space';
    
    for (const b of newModel.project.buildings) {
      for (const l of b.levels) {
        if (l.id === newModel.activeLevelId) {
          const space = l.spaces.find(s => s.id === id);
          if (space) {
            spaceName = space.name;
            space.x = x;
            space.y = y;
          }
        }
      }
    }
    
    const syncedModel = syncLegacyFields(newModel);
    
    // Naive intent evaluation for demo
    const isPrivacyWeakened = spaceName.toLowerCase().includes('bed') && Math.random() > 0.5;
    
    const event: ChangeEvent = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      description: `YOU MOVED ${spaceName.toUpperCase()}`,
      details: [
        { category: 'Geometry', message: 'Position updated' },
        { category: 'Intent', message: isPrivacyWeakened ? 'Privacy priority weakened' : 'Privacy maintained', metric: isPrivacyWeakened ? '⚠️' : '✓' }
      ]
    };
    
    return { model: syncedModel, changeLedger: [event, ...state.changeLedger].slice(0, 5) };
  }),

  updateSpaceDimensions: (id, width, height) => set((state) => {
    const newModel = JSON.parse(JSON.stringify(state.model)) as SemanticModel;
    for (const b of newModel.project.buildings) {
      for (const l of b.levels) {
        if (l.id === newModel.activeLevelId) {
          l.spaces = l.spaces.map(s => s.id === id ? { ...s, width, height } : s);
        }
      }
    }
    return { model: syncLegacyFields(newModel) };
  }),

  resetModel: () => set((state) => ({ 
    model: JSON.parse(JSON.stringify(state.originalModel)),
    activeVariant: "original",
  previewVariantModel: null,
  setPreviewVariantModel: (model) => set({ previewVariantModel: model }),
    changeLedger: []
  })),

  applyVariant: (variantModel, variantType) => set({ 
    model: variantModel,
    activeVariant: variantType
  }),
}));
