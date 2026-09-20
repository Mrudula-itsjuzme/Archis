const fs = require('fs');

let content = fs.readFileSync('src/store/useStore.ts', 'utf8');

// Change `(set) => ({` to `(set, get) => ({`
content = content.replace(
  'export const useStore = create<StoreState>((set) => ({',
  'export const useStore = create<StoreState>((set, get) => ({\n' +
  '  user: null,\n' +
  '  setUser: (user) => {\n' +
  '    set({ user });\n' +
  '    if (user) get().fetchSavedProjects();\n' +
  '  },\n' +
  '  savedProjects: [],\n' +
  '  fetchSavedProjects: async () => {\n' +
  '    const user = get().user;\n' +
  '    if (!user) return;\n' +
  '    try {\n' +
  '      const { db } = await import("../lib/firebase");\n' +
  '      const { collection, getDocs, query, where } = await import("firebase/firestore");\n' +
  '      const q = query(collection(db, "projects"), where("userId", "==", user.uid));\n' +
  '      const snapshot = await getDocs(q);\n' +
  '      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));\n' +
  '      set({ savedProjects: projects });\n' +
  '    } catch (e) { console.error("Error fetching projects:", e); }\n' +
  '  },\n' +
  '  saveCurrentProject: async () => {\n' +
  '    const state = get();\n' +
  '    if (!state.user) return alert("Please sign in to save projects");\n' +
  '    try {\n' +
  '      const { db } = await import("../lib/firebase");\n' +
  '      const { collection, addDoc, updateDoc, doc, serverTimestamp } = await import("firebase/firestore");\n' +
  '      const projectData = {\n' +
  '        userId: state.user.uid,\n' +
  '        model: state.model,\n' +
  '        blueprintUrl: state.blueprintUrl,\n' +
  '        updatedAt: serverTimestamp()\n' +
  '      };\n' +
  '      if (state.model.project.id && state.model.project.id.length > 10) {\n' +
  '        await updateDoc(doc(db, "projects", state.model.project.id), projectData);\n' +
  '      } else {\n' +
  '        const docRef = await addDoc(collection(db, "projects"), {\n' +
  '          ...projectData,\n' +
  '          name: state.model.project.name || "Untitled Project",\n' +
  '          createdAt: serverTimestamp()\n' +
  '        });\n' +
  '        set(s => ({ model: { ...s.model, project: { ...s.model.project, id: docRef.id } } }));\n' +
  '      }\n' +
  '      get().fetchSavedProjects();\n' +
  '      alert("Project saved!");\n' +
  '    } catch (e) { console.error("Error saving:", e); alert("Failed to save project"); }\n' +
  '  },\n' +
  '  loadSavedProject: async (id: string) => {\n' +
  '    try {\n' +
  '      const { db } = await import("../lib/firebase");\n' +
  '      const { doc, getDoc } = await import("firebase/firestore");\n' +
  '      const docRef = doc(db, "projects", id);\n' +
  '      const snapshot = await getDoc(docRef);\n' +
  '      if (snapshot.exists()) {\n' +
  '        const data = snapshot.data();\n' +
  '        set({\n' +
  '          model: { ...data.model, project: { ...data.model.project, id } },\n' +
  '          blueprintUrl: data.blueprintUrl,\n' +
  '          workspaceMode: "plan",\n' +
  '          activeLevelId: null,\n' +
  '          selectedSpaceId: null,\n' +
  '        });\n' +
  '      }\n' +
  '    } catch (e) { console.error("Error loading:", e); }\n' +
  '  },\n'
);

fs.writeFileSync('src/store/useStore.ts', content);
