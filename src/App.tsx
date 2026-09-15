import React from 'react';
import Sidebar from './components/layout/Sidebar';
import MainWorkspace from './components/layout/MainWorkspace';
import RightSidebar from './components/layout/RightSidebar';

function App() {
  return (
    <div className="relative w-screen h-screen bg-[#efedea] overflow-hidden text-[#2c2c2c] font-sans">
      <MainWorkspace />
      
      {/* Floating Left Sidebar */}
      <div className="absolute top-4 left-4 bottom-4 z-20 pointer-events-none">
        <div className="pointer-events-auto h-full">
          <Sidebar />
        </div>
      </div>

      {/* Floating Right Sidebar */}
      <div className="absolute top-4 right-4 bottom-4 z-20 pointer-events-none">
        <div className="pointer-events-auto h-full">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}

export default App;
