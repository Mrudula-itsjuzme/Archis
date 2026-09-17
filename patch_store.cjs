const fs = require('fs');

let content = fs.readFileSync('src/store/useStore.ts', 'utf8');

// Add imports
if (!content.includes('import { db } from')) {
  content = content.replace(
    "import { extractRoomsWithGemini, getRecommendations, Recommendation } from './gemini';",
    "import { extractRoomsWithGemini, getRecommendations, Recommendation } from './gemini';\nimport { db } from '../lib/firebase';\nimport { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';"
  );
}

// Add state to interface
if (!content.includes('user: any;')) {
  content = content.replace(
    "interface StoreState {",
    "interface StoreState {\n  user: any;\n  setUser: (user: any) => void;\n  savedProjects: any[];\n  fetchSavedProjects: () => Promise<void>;\n  saveCurrentProject: () => Promise<void>;\n  loadProject: (id: string) => Promise<void>;\n"
  );
}

// Add state to implementation
if (!content.includes('user: null,')) {
  content = content.replace(
    "export const useStore = create<StoreState>((set, get) => ({",
    "export const useStore = create<StoreState>((set, get) => ({\n  user: null,\n  setUser: (user) => {\n    set({ user });\n    if (user) get().fetchSavedProjects();\n  },\n  savedProjects: [],\n  fetchSavedProjects: async () => {\n    const user = get().user;\n    if (!user) return;\n    try {\n      const q = query(collection(db, 'projects'), where('userId', '==', user.uid));\n      const snapshot = await getDocs(q);\n      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));\n      set({ savedProjects: projects });\n    } catch (e) { console.error('Error fetching projects:', e); }\n  },\n  saveCurrentProject: async () => {\n    const state = get();\n    if (!state.user) return alert('Please sign in to save projects');\n    try {\n      const projectData = {\n        userId: state.user.uid,\n        model: state.model,\n        blueprintUrl: state.blueprintUrl,\n        updatedAt: serverTimestamp()\n      };\n      if (state.model.project.id && state.model.project.id.length > 10) {\n        // Update existing\n        await updateDoc(doc(db, 'projects', state.model.project.id), projectData);\n      } else {\n        // Create new\n        const docRef = await addDoc(collection(db, 'projects'), {\n          ...projectData,\n          name: state.model.project.name || 'Untitled Project',\n          createdAt: serverTimestamp()\n        });\n        set(s => ({\n          model: { ...s.model, project: { ...s.model.project, id: docRef.id } }\n        }));\n      }\n      get().fetchSavedProjects();\n      alert('Project saved!');\n    } catch (e) { console.error('Error saving:', e); alert('Failed to save project'); }\n  },\n  loadProject: async (id: string) => {\n    try {\n      const docRef = doc(db, 'projects', id);\n      const snapshot = await getDoc(docRef);\n      if (snapshot.exists()) {\n        const data = snapshot.data();\n        set({\n          model: { ...data.model, project: { ...data.model.project, id } },\n          blueprintUrl: data.blueprintUrl,\n          workspaceMode: 'plan',\n          activeLevelId: null,\n          selectedSpaceId: null,\n        });\n      }\n    } catch (e) { console.error('Error loading:', e); }\n  },"
  );
}

fs.writeFileSync('src/store/useStore.ts', content);
