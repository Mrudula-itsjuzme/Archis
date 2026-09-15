import React from 'react';
import Sidebar from './components/layout/Sidebar';
import MainWorkspace from './components/layout/MainWorkspace';
import RightSidebar from './components/layout/RightSidebar';

function App() {
  return (
    <div className="flex h-screen w-screen bg-paper overflow-hidden text-charcoal">
      <Sidebar />
      <MainWorkspace />
      <RightSidebar />
    </div>
  );
}

export default App;
