import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';

export default function ExtractionProgress() {
  const isExtracting = useStore(state => state.isExtracting);
  const [step, setStep] = useState(0);

  const steps = [
    "Analyzing image...",
    "Detecting walls & rooms...",
    "Building spatial graph...",
    "Generating semantic floor plan..."
  ];

  useEffect(() => {
    if (isExtracting) {
      setStep(0);
      const interval = setInterval(() => {
        setStep(s => Math.min(s + 1, steps.length - 1));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isExtracting]);

  if (!isExtracting) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-80 p-6 flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-[#3b5998] rounded-full animate-spin mb-6"></div>
        
        <h3 className="font-bold text-gray-900 text-lg mb-2">Simulated Demo Extraction</h3>
        <p className="text-gray-500 text-sm font-medium mb-6 h-5">{steps[step]}</p>
        
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#3b5998] transition-all duration-500 ease-out" 
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
