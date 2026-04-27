import { useState, useEffect } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const DyslexiaFriendly = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('dyslexia-friendly');
      localStorage.setItem('dyslexiaFriendly', 'true');
    } else {
      document.documentElement.classList.remove('dyslexia-friendly');
      localStorage.setItem('dyslexiaFriendly', 'false');
    }
  }, [enabled]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3"><DocumentTextIcon className="w-6 h-6 text-primary-500" /><div><p className="font-medium">Dyslexia Friendly Font</p><p className="text-xs text-gray-500">OpenDyslexic font for easier reading</p></div></div>
        <button onClick={() => setEnabled(!enabled)} className={`relative w-12 h-6 rounded-full transition ${enabled ? 'bg-primary-500' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${enabled ? 'right-1' : 'left-1'}`} /></button>
      </div>
    </div>
  );
};

export default DyslexiaFriendly;
