import { create } from 'zustand';
import { SemanticModel, Space, VariantType, ChangeEvent, Project } from '../models/types';
import { initialModel, courtyardHouseProject, apartmentFloorProject, schoolWingProject } from './initialData';
import type { Recommendation } from './gemini';

interface StoreState {
  model: SemanticModel;
  originalModel: SemanticModel;
  
  // UI State
  activeLevelId: string | null;
  selectedSpaceId: string | null;
  hoveredSpaceId: string | null;
  clientViewMode: boolean;
  isDragging3D: boolean;
  setIsDragging3D: (isDragging: boolean) => void;
  isExtracting: boolean;
  extractBlueprint: () => Promise<void>;
  setClientViewMode: (enabled: boolean) => void;

  // Recommendations
  recommendations: Recommendation[];
  isLoadingRecommendations: boolean;
  fetchRecommendations: () => Promise<void>;
  applyRecommendation: (rec: Recommendation) => void;

  workspaceMode: 'plan' | '3d' | 'split';
  semanticOverlay: 'none' | 'privacy' | 'circulation' | 'daylight';
  setSemanticOverlay: (overlay: 'none' | 'privacy' | 'circulation' | 'daylight') => void;
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
  isDragging3D: false,
  setIsDragging3D: (isDragging3D) => set({ isDragging3D }),
  workspaceMode: "split",
  semanticOverlay: "none",
  setSemanticOverlay: (overlay) => set({ semanticOverlay: overlay }),
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
  isExtracting: false,
  recommendations: [],
  isLoadingRecommendations: false,

  fetchRecommendations: async () => {
    const { model } = useStore.getState();
    if (model.rooms.length === 0) return;
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || '';
    if (!apiKey) return;
    set({ isLoadingRecommendations: true });
    try {
      const { getRecommendations } = await import('./gemini');
      const recs = await getRecommendations(model.rooms, apiKey);
      set({ recommendations: recs, isLoadingRecommendations: false });
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      set({ isLoadingRecommendations: false });
    }
  },

  applyRecommendation: (rec) => set((state) => {
    const newModel = JSON.parse(JSON.stringify(state.model)) as SemanticModel;
    for (const change of rec.changes) {
      for (const b of newModel.project.buildings) {
        for (const l of b.levels) {
          const space = l.spaces.find(s => s.id === change.spaceId);
          if (space) {
            if (change.type === 'resize') {
              if (change.newWidth !== undefined) space.width = change.newWidth;
              if (change.newHeight !== undefined) space.height = change.newHeight;
            } else if (change.type === 'move') {
              if (change.newX !== undefined) space.x = change.newX;
              if (change.newY !== undefined) space.y = change.newY;
            } else if (change.type === 'rename' && change.newName) {
              space.name = change.newName;
            }
          }
        }
      }
    }
    const synced = syncLegacyFields(newModel);
    // Remove applied recommendation from list
    const remaining = state.recommendations.filter(r => r.id !== rec.id);
    return { model: synced, recommendations: remaining };
  }),

  extractBlueprint: async () => {
    const { blueprintUrl, model } = useStore.getState();
    if (!blueprintUrl) return;

    set({ isExtracting: true });
    
    // Check if it's a data URL (needed for Gemini)
    const isDataUrl = blueprintUrl.startsWith('data:');
    
    let apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || '';
    if (isDataUrl && !import.meta.env.VITE_GEMINI_API_KEY) {
       const userKey = window.prompt("Enter Gemini API Key for REAL AI extraction (or leave blank to use simulated demo):", apiKey);
       if (userKey !== null) {
          apiKey = userKey.trim();
          if (apiKey) localStorage.setItem('GEMINI_API_KEY', apiKey);
       }
    }

    if (apiKey && isDataUrl) {
      try {
        const { extractRoomsWithGemini } = await import('./gemini');
        const extractedRooms = await extractRoomsWithGemini(blueprintUrl, apiKey);
        
        set(state => {
          const newModel = JSON.parse(JSON.stringify(state.model)) as SemanticModel;
          const activeLevel = newModel.project.buildings[0].levels[0]; // Simplification for demo
          activeLevel.spaces = extractedRooms;
          
          return {
            isExtracting: false,
            recommendations: [], // clear old ones
            model: {
              ...newModel,
              activeLevelId: activeLevel.id,
              rooms: activeLevel.spaces
            }
          };
        });
        // Fetch AI recommendations in the background
        setTimeout(() => useStore.getState().fetchRecommendations(), 500);
        return;
      } catch (err) {
        console.error("Gemini Extraction failed:", err);
        alert("Real extraction failed. Falling back to simulation. Error: " + (err as Error).message);

      }
    }

    // Fallback Mock
    await new Promise(r => setTimeout(r, 2000));
    set(state => {
      return { 
        isExtracting: false,
        model: {
          ...state.model,
          project: schoolWingProject,
          activeLevelId: schoolWingProject.buildings[0].levels[0].id,
          rooms: schoolWingProject.buildings[0].levels[0].spaces
        }
      };
    });
  },
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
