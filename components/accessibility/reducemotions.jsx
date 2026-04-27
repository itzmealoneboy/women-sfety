import { useState, useEffect } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const ReducedMotion = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('reduce-motion');
      localStorage.setItem('reduceMotion', 'true');
    } else {
      document.documentElement.classList.remove('reduce-motion');
      localStorage.setItem('reduceMotion', 'false');
    }
  }, [enabled]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3"><ArrowPathIcon className="w-6 h-6 text-primary-500" /><div><p className="font-medium">Reduced Motion</p><p className="text-xs text-gray-500">Disable animations for better accessibility</p></div></div>
        <button onClick={() => setEnabled(!enabled)} className={`relative w-12 h-6 rounded-full transition ${enabled ? 'bg-primary-500' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${enabled ? 'right-1' : 'left-1'}`} /></button>
      </div>
    </div>
  );
};

export default ReducedMotion;
