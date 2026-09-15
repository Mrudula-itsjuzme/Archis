import React from 'react';
import Sidebar from './components/layout/Sidebar';
import MainWorkspace from './components/layout/MainWorkspace';

function App() {
  return (
    <div className="flex h-screen w-screen bg-paper overflow-hidden text-charcoal">
      <Sidebar />
      <MainWorkspace />
    </div>
  );
}

export default App;
