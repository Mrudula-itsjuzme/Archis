import React from 'react';
import Sidebar from './components/layout/Sidebar';
import MainWorkspace from './components/layout/MainWorkspace';
import RightSidebar from './components/layout/RightSidebar';

function App() {
  return (
    <div className="flex h-screen w-screen bg-[#f5f4f1] overflow-hidden text-[#2c2c2c] p-4 gap-4 font-sans">
      <Sidebar />
      <MainWorkspace />
      <RightSidebar />
    </div>
  );
}

export default App;
