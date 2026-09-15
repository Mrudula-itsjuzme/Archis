const fs = require('fs');
let code = fs.readFileSync('src/store/useStore.ts', 'utf8');

code = code.replace(
  'setBlueprintConfig: (config) => set((state) => ({',
  `isExtracting: false,
  extractBlueprint: async () => {
    set({ isExtracting: true });
    await new Promise(r => setTimeout(r, 2000));
    set(state => {
      // Import school wing layout as the auto-extracted result
      const { schoolWingProject } = require('./initialData');
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
  setBlueprintConfig: (config) => set((state) => ({`
);

fs.writeFileSync('src/store/useStore.ts', code);
