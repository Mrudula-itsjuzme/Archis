import { create } from 'zustand';
import { SemanticModel, Space, VariantType, ChangeEvent, Project, ProjectRevision, RevisionHistory, SpaceProperty } from '../models/types';
import { migrateRectanglesToGraph } from '../utils/geometryGraph';
import { initialModel, courtyardHouseProject, apartmentFloorProject, schoolWingProject } from './initialData';
import type { Recommendation } from './gemini';
import { appendRevision, createBranch, createRevisionHistory, createSpacePropertyOperations, getActiveBranch, materializeBranch, updateRevisionStatus } from '../engine/revisions';
import { evaluateAllConstraints } from '../engine/constraints';

interface StoreState {
  user: any;
  setUser: (user: any) => void;
  savedProjects: any[];
  fetchSavedProjects: () => Promise<void>;
  saveCurrentProject: () => Promise<void>;
  loadSavedProject: (id: string) => Promise<void>;

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
  triggerExport3D: boolean;
  setTriggerExport3D: (trigger: boolean) => void;
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
  calibrationMode: 'idle' | 'step1' | 'step2';
  calibrationPt1: {x: number, y: number} | null;
  setCalibrationMode: (mode: 'idle' | 'step1' | 'step2', pt?: {x: number, y: number}) => void;
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
  moveVertex: (vertexId: string, x: number, y: number) => void;
  selectedVertexId: string | null;
  setSelectedVertexId: (id: string | null) => void;
  editorMode: 'select' | 'draw' | 'door' | 'window';
  setEditorMode: (mode: 'select' | 'draw' | 'door' | 'window') => void;
  resetModel: () => void;
  applyVariant: (variantModel: SemanticModel, variantType: VariantType) => void;

  // Revision history. Every accepted model change is a typed patch on a named branch.
  revisionHistory: RevisionHistory;
  revisionNotice: string | null;
  createRevisionBranch: (name: string) => void;
  switchRevisionBranch: (branchId: string) => void;
  revertLatestRevision: () => void;
  updateSpaceProperties: (id: string, updates: Partial<Pick<Space, SpaceProperty>>) => void;
}

function revisionId() {
  return `revision-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function branchId() {
  return `branch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function revisionAuthor(user: any): string {
  return user?.displayName || user?.email || 'Architect';
}

function makeRevision(
  state: Pick<StoreState, 'revisionHistory' | 'user'>,
  operations: ProjectRevision['operations'],
  summary: string,
  source: ProjectRevision['source'] = 'architect',
): ProjectRevision {
  const branch = getActiveBranch(state.revisionHistory);
  return {
    id: revisionId(),
    branchId: branch.id,
    parentRevisionId: branch.revisionIds.at(-1) ?? branch.baseRevisionId,
    timestamp: Date.now(),
    author: revisionAuthor(state.user),
    source,
    status: 'accepted',
    summary,
    operations,
    affectedEntityIds: [...new Set(operations.map(operation => operation.spaceId))],
    preservedConstraints: [],
  };
}

function applyAcceptedRevision(
  state: Pick<StoreState, 'originalModel' | 'revisionHistory'>,
  revision: ProjectRevision,
) {
  const history = appendRevision(state.revisionHistory, revision);
  const candidate = materializeBranch(state.originalModel, history);
  const violations = evaluateAllConstraints(candidate)
    .filter(({ constraint, result }) => constraint.type === 'HARD' && result.isViolated);

  if (violations.length > 0) {
    const rejectedHistory = updateRevisionStatus(history, revision.id, 'rejected');
    return {
      revisionHistory: rejectedHistory,
      model: materializeBranch(state.originalModel, rejectedHistory),
      revisionNotice: `Change not applied: ${violations[0].result.message || violations[0].constraint.description}`,
      applied: false,
    };
  }

  const preservedConstraints = evaluateAllConstraints(candidate)
    .filter(({ constraint, result }) => constraint.type === 'HARD' && !result.isViolated)
    .map(({ constraint }) => constraint.description);
  const acceptedHistory = updateRevisionStatus(history, revision.id, 'accepted');
  return {
    revisionHistory: {
      ...acceptedHistory,
      revisions: acceptedHistory.revisions.map(item => item.id === revision.id
        ? { ...item, preservedConstraints }
        : item),
    },
    model: candidate,
    revisionNotice: null,
    applied: true,
  };
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

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  setUser: (user) => {
    set({ user });
    if (user) get().fetchSavedProjects();
  },
  savedProjects: [],
  fetchSavedProjects: async () => {
    const user = get().user;
    if (!user) return;
    try {
      const { db } = await import("../lib/firebase");
      const { collection, getDocs, query, where } = await import("firebase/firestore");
      const q = query(collection(db, "projects"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ savedProjects: projects });
    } catch (e) { console.error("Error fetching projects:", e); }
  },
  saveCurrentProject: async () => {
    const state = get();
    if (!state.user) return alert("Please sign in to save projects");
    try {
      const { db } = await import("../lib/firebase");
      const { collection, addDoc, updateDoc, doc, serverTimestamp } = await import("firebase/firestore");
      const projectData = {
        userId: state.user.uid,
        model: state.model,
        blueprintUrl: state.blueprintUrl,
        updatedAt: serverTimestamp()
      };
      if (state.model.project.id && state.model.project.id.length > 10) {
        await updateDoc(doc(db, "projects", state.model.project.id), projectData);
      } else {
        const docRef = await addDoc(collection(db, "projects"), {
          ...projectData,
          name: state.model.project.name || "Untitled Project",
          createdAt: serverTimestamp()
        });
        set(s => ({ model: { ...s.model, project: { ...s.model.project, id: docRef.id } } }));
      }
      get().fetchSavedProjects();
      alert("Project saved!");
    } catch (e) { console.error("Error saving:", e); alert("Failed to save project"); }
  },
  loadSavedProject: async (id: string) => {
    try {
      const { db } = await import("../lib/firebase");
      const { doc, getDoc } = await import("firebase/firestore");
      const docRef = doc(db, "projects", id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        set({
          model: migrateRectanglesToGraph({ ...data.model, project: { ...data.model.project, id } }),
          blueprintUrl: data.blueprintUrl,
          workspaceMode: "plan",
          activeLevelId: null,
          selectedSpaceId: null,
        });
      }
    } catch (e) { console.error("Error loading:", e); }
  },

  model: JSON.parse(JSON.stringify(initialModel)),
  originalModel: migrateRectanglesToGraph(initialModel),
  
  activeLevelId: null,
  selectedSpaceId: null,
  hoveredSpaceId: null,
  setSelectedSpaceId: (id) => set({ selectedSpaceId: id }),
  setHoveredSpaceId: (id) => set({ hoveredSpaceId: id }),
  selectedVertexId: null,
  setSelectedVertexId: (id) => set({ selectedVertexId: id }),
  editorMode: 'select' as 'select' | 'draw' | 'door' | 'window',
  setEditorMode: (mode) => set({ editorMode: mode }),

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
  revisionHistory: createRevisionHistory(),
  revisionNotice: null,

  blueprintUrl: null,
  blueprintOpacity: 0.4,
  blueprintScale: 40,
  blueprintRotation: 0,
  blueprintOffsetX: 100,
  blueprintOffsetY: 100,
  blueprintLocked: false,
  calibrationMode: 'idle' as 'idle' | 'step1' | 'step2',
  calibrationPt1: null as {x: number, y: number} | null,
  setCalibrationMode: (mode: 'idle' | 'step1' | 'step2', pt?: {x: number, y: number}) => set((s: any) => ({ calibrationMode: mode, calibrationPt1: pt !== undefined ? pt : s.calibrationPt1 })),
  isExtracting: false,
  triggerExport3D: false,
  setTriggerExport3D: (t) => set({ triggerExport3D: t }),
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
    const operations = rec.changes.flatMap(change => {
      const space = state.model.rooms.find(room => room.id === change.spaceId);
      if (!space) return [];
      if (change.type === 'resize') {
        return createSpacePropertyOperations(space, { width: change.newWidth, height: change.newHeight });
      }
      if (change.type === 'move') {
        return createSpacePropertyOperations(space, { x: change.newX, y: change.newY });
      }
      return createSpacePropertyOperations(space, { name: change.newName });
    });
    if (operations.length === 0) return { revisionNotice: 'Recommendation has no applicable changes.' };

    const revision = makeRevision(state, operations, `Accept recommendation: ${rec.title}`, 'inference');
    const applied = applyAcceptedRevision(state, revision);
    return {
      ...applied,
      recommendations: applied.applied ? state.recommendations.filter(item => item.id !== rec.id) : state.recommendations,
    };
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
        const { extractBlueprintWithGemini } = await import('./gemini');
        const extraction = await extractBlueprintWithGemini(blueprintUrl, apiKey);
        
        const rooms = extraction.rooms;
        
        set(state => {
          const newModel = migrateRectanglesToGraph({
            ...state.model,
            rooms,
            doors: [],
            // Store extraction metadata on the model for the UI to read
            extractionMeta: {
              scale_confidence: extraction.scale_confidence,
              estimated_scale_note: extraction.estimated_scale_note,
              overall_confidence: extraction.overall_confidence,
              building_type: extraction.building_type,
              undetected_elements: extraction.undetected_elements,
              notes: extraction.notes,
              detected_doors: extraction.doors,
              detected_windows: extraction.windows,
            }
          } as any);
          
          return {
            isExtracting: false,
            recommendations: [],
            model: newModel,
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
      originalModel: JSON.parse(JSON.stringify(newModel)),
      activeVariant: "original",
      previewVariantModel: null,
      changeLedger: [],
      revisionHistory: createRevisionHistory(),
      revisionNotice: null,
      activeLevelId: null,
      selectedSpaceId: null,
      hoveredSpaceId: null
    };
  }),

  updateSpacePosition: (id, x, y) => get().updateSpaceProperties(id, { x, y }),

  updateSpaceDimensions: (id, width, height) => get().updateSpaceProperties(id, { width, height }),

  moveVertex: (vertexId, nx, ny) => set((state) => {
    if (!state.model.vertices) return {};
    // Snap to 0.25m grid
    const x = Math.round(nx * 4) / 4;
    const y = Math.round(ny * 4) / 4;

    const newVertices = state.model.vertices.map(v =>
      v.id === vertexId ? { ...v, x, y } : v
    );
    const vertexById = new Map(newVertices.map(v => [v.id, v]));

    // Recalculate each room's bbox from its vertices array
    const newRooms = state.model.rooms.map(room => {
      if (!room.vertices || room.vertices.length === 0) return room;
      const pts = room.vertices.map((vid: string) => vertexById.get(vid)!).filter(Boolean);
      if (pts.length === 0) return room;
      const minX = Math.min(...pts.map((p: any) => p.x));
      const minY = Math.min(...pts.map((p: any) => p.y));
      const maxX = Math.max(...pts.map((p: any) => p.x));
      const maxY = Math.max(...pts.map((p: any) => p.y));
      const newWidth = Math.max(0.5, maxX - minX);
      const newHeight = Math.max(0.5, maxY - minY);
      return { ...room, x: minX, y: minY, width: newWidth, height: newHeight };
    });

    return {
      model: {
        ...state.model,
        vertices: newVertices,
        rooms: newRooms,
      }
    };
  }),

  resetModel: () => set((state) => ({ 
    model: JSON.parse(JSON.stringify(state.originalModel)),
    activeVariant: "original",
    previewVariantModel: null,
    changeLedger: [],
    revisionHistory: createRevisionHistory(),
    revisionNotice: null,
  })),

  applyVariant: (variantModel, variantType) => set((state) => {
    const nextHistory = createBranch(
      state.revisionHistory,
      variantType === 'original' ? 'Architect draft option' : `Option ${variantType}`,
      branchId(),
    );
    const operations = state.model.rooms.flatMap(space => {
      const candidate = variantModel.rooms.find(room => room.id === space.id);
      return candidate ? createSpacePropertyOperations(space, candidate) : [];
    });
    if (operations.length === 0) return { revisionHistory: nextHistory, activeVariant: variantType };

    const revision = makeRevision(
      { ...state, revisionHistory: nextHistory },
      operations,
      `Accept ${variantType} option`,
      'deterministic-engine',
    );
    const applied = applyAcceptedRevision({ ...state, revisionHistory: nextHistory }, revision);
    return { ...applied, activeVariant: applied.applied ? variantType : state.activeVariant };
  }),

  createRevisionBranch: (name) => set((state) => {
    const trimmedName = name.trim();
    if (!trimmedName) return { revisionNotice: 'A branch needs a name.' };
    return {
      revisionHistory: createBranch(state.revisionHistory, trimmedName, branchId()),
      revisionNotice: null,
    };
  }),

  switchRevisionBranch: (id) => set((state) => {
    if (!state.revisionHistory.branches.some(branch => branch.id === id)) {
      return { revisionNotice: 'That branch is no longer available.' };
    }
    const revisionHistory = { ...state.revisionHistory, activeBranchId: id };
    return {
      revisionHistory,
      model: materializeBranch(state.originalModel, revisionHistory),
      previewVariantModel: null,
      revisionNotice: null,
    };
  }),

  revertLatestRevision: () => set((state) => {
    const branch = getActiveBranch(state.revisionHistory);
    const latest = [...branch.revisionIds].reverse()
      .map(id => state.revisionHistory.revisions.find(revision => revision.id === id))
      .find(revision => revision?.status === 'accepted');
    if (!latest) return { revisionNotice: 'There is no accepted change to revert on this branch.' };
    const revisionHistory = updateRevisionStatus(state.revisionHistory, latest.id, 'reverted');
    return {
      revisionHistory,
      model: materializeBranch(state.originalModel, revisionHistory),
      revisionNotice: `Reverted: ${latest.summary}`,
    };
  }),

  updateSpaceProperties: (id, updates) => set((state) => {
    const space = state.model.rooms.find(room => room.id === id);
    if (!space) return { revisionNotice: 'That space is no longer available.' };
    if (space.isLocked) return { revisionNotice: `${space.name} is locked and cannot be changed.` };

    const operations = createSpacePropertyOperations(space, updates);
    if (operations.length === 0) return {};
    const revision = makeRevision(state, operations, `Edit ${space.name}`);
    const applied = applyAcceptedRevision(state, revision);
    const event: ChangeEvent = {
      id: revision.id,
      timestamp: revision.timestamp,
      description: applied.applied ? revision.summary : `Rejected edit to ${space.name}`,
      details: applied.applied
        ? [
          { category: 'Geometry', message: `${operations.length} property change${operations.length === 1 ? '' : 's'} recorded` },
          { category: 'Constraint', message: 'Hard constraints preserved', metric: '✓' },
        ]
        : [{ category: 'Constraint', message: applied.revisionNotice || 'Hard constraint conflict', metric: '⚠️' }],
    };
    return {
      ...applied,
      changeLedger: [event, ...state.changeLedger].slice(0, 20),
    };
  }),
}));
